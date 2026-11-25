const API_ROOT = 'https://images-api.nasa.gov';
const PAGE_SIZE = 36;
const cache = new Map();

function makeUrl(path, params = {}) {
  const url = new URL(`${API_ROOT}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      url.searchParams.set(key, String(value).trim());
    }
  });
  return url.toString();
}

async function requestJson(url, { signal, cacheKey, ttl = 90_000 } = {}) {
  if (cacheKey && cache.has(cacheKey)) {
    const entry = cache.get(cacheKey);
    if (Date.now() - entry.time < ttl) return entry.data;
    cache.delete(cacheKey);
  }

  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`The archive returned an unreadable response (${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(payload?.reason || payload?.error?.message || `Archive service error: ${response.status}`);
  }
  if (cacheKey) cache.set(cacheKey, { time: Date.now(), data: payload });
  return payload;
}

export function normalizeMedia(item) {
  const data = Array.isArray(item?.data) ? item.data[0] : item?.data || {};
  const links = Array.isArray(item?.links) ? item.links : [];
  const preview = links.find((link) => link.rel === 'preview')?.href
    || links.find((link) => link.render === 'image')?.href
    || links[0]?.href
    || '';
  const nasaId = data.nasa_id || data.nasaId || '';

  return {
    nasaId,
    title: data.title || 'Untitled NASA media',
    description: data.description || 'No description is available for this item.',
    dateCreated: data.date_created || '',
    mediaType: data.media_type || 'image',
    center: data.center || '',
    photographer: data.photographer || '',
    secondaryCreator: data.secondary_creator || '',
    location: data.location || '',
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    album: Array.isArray(data.album) ? data.album : [],
    credit: data.credit || '',
    description508: data.description_508 || '',
    preview,
    raw: data,
  };
}

export async function searchMedia(filters = {}, { page = 1, signal, pageSize = PAGE_SIZE } = {}) {
  const params = {
    q: filters.q,
    media_type: filters.media_type,
    year_start: filters.year_start,
    year_end: filters.year_end,
    center: filters.center,
    title: filters.title,
    description: filters.description,
    keywords: filters.keywords,
    location: filters.location,
    photographer: filters.photographer,
    secondary_creator: filters.secondary_creator,
    description_508: filters.description_508,
    nasa_id: filters.nasa_id,
    page,
    page_size: pageSize,
  };

  const hasCriteria = Object.entries(params).some(([key, value]) => !['page', 'page_size'].includes(key) && String(value || '').trim());
  if (!hasCriteria) return { items: [], totalHits: 0, page, pageSize, hasMore: false };

  const url = makeUrl('/search', params);
  const payload = await requestJson(url, { signal, cacheKey: `${url}` });
  const collection = payload?.collection || {};
  const items = (collection.items || []).map(normalizeMedia).filter((item) => item.nasaId);
  const totalHits = Number(collection.metadata?.total_hits ?? collection.metadata?.totalHits ?? 0);
  const hasMore = items.length > 0 && (page * pageSize < totalHits || items.length === pageSize);

  return { items, totalHits, page, pageSize, hasMore };
}

export async function getAssetManifest(nasaId, { signal } = {}) {
  const url = makeUrl(`/asset/${encodeURIComponent(nasaId)}`);
  return requestJson(url, { signal, cacheKey: `asset:${nasaId}`, ttl: 10 * 60_000 });
}

export async function getMediaMetadata(nasaId, { signal } = {}) {
  const url = makeUrl(`/metadata/${encodeURIComponent(nasaId)}`);
  return requestJson(url, { signal, cacheKey: `metadata:${nasaId}`, ttl: 10 * 60_000 });
}

export async function getCaptions(nasaId, { signal } = {}) {
  const url = makeUrl(`/captions/${encodeURIComponent(nasaId)}`);
  return requestJson(url, { signal, cacheKey: `captions:${nasaId}`, ttl: 10 * 60_000 });
}

// NASA album names are case-sensitive. This endpoint is separate from /search.
export async function getAlbum(albumName, { page = 1, signal } = {}) {
  const url = makeUrl(`/album/${encodeURIComponent(albumName)}`, { page });
  const payload = await requestJson(url, { signal, cacheKey: `album:${albumName}:${page}`, ttl: 5 * 60_000 });
  const collection = payload?.collection || {};
  const items = (collection.items || []).map(normalizeMedia).filter((item) => item.nasaId);
  const totalHits = Number(collection.metadata?.total_hits ?? 0);
  return { items, totalHits, page, hasMore: Boolean(collection.links?.some((link) => link.rel === 'next')) };
}

export async function getMediaMetadataDocument(nasaId, { signal } = {}) {
  const locationPayload = await getMediaMetadata(nasaId, { signal });
  const location = resolveLocation(locationPayload);
  if (!location) return { location: '', data: null };
  const data = await requestJson(location, { signal, cacheKey: `metadata-document:${nasaId}`, ttl: 10 * 60_000 });
  return { location, data };
}

export function chooseMediaAsset(manifest, mediaType = 'image') {
  const entries = manifest?.collection?.items || manifest?.items || [];
  const urls = entries.map((entry) => typeof entry === 'string' ? entry : entry?.href || entry?.url || '').filter(Boolean);
  if (!urls.length) return '';

  const score = (url) => {
    const value = url.toLowerCase();
    let result = 0;
    if (value.includes('~orig') || value.includes('-orig')) result += 100;
    if (value.includes('large')) result += 70;
    if (value.includes('medium')) result += 40;
    if (value.includes('small')) result += 20;
    if (value.includes('thumb')) result -= 30;
    if (mediaType === 'video') {
      if (value.endsWith('.mp4')) result += 80;
      else result -= 100;
    } else if (mediaType === 'audio') {
      if (/\.(mp3|wav|m4a|ogg)(\?|$)/.test(value)) result += 80;
      else result -= 100;
    } else {
      if (/\.(jpg|jpeg|png|webp|gif)(\?|$)/.test(value)) result += 30;
      if (/\.(tif|tiff)(\?|$)/.test(value)) result -= 10;
      if (/\.(mp4|mov|mp3|wav)(\?|$)/.test(value)) result -= 100;
    }
    return result;
  };
  return [...urls].sort((a, b) => score(b) - score(a))[0];
}

export function resolveLocation(payload) {
  return payload?.location || payload?.collection?.href || '';
}

export function getPageSize() {
  return PAGE_SIZE;
}
