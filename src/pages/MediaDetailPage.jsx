import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Bookmark, CalendarDays, Check, Copy, Download, ExternalLink, FileJson, MapPin, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getAssetManifest, getCaptions, getMediaMetadataDocument, searchMedia, chooseMediaAsset, resolveLocation } from '../services/nasaApi.js';
import { useLibrary } from '../context/LibraryContext.jsx';
import MediaPlayerComp from '../components/media/MediaPlayerComp.jsx';
import EmptyStateComp from '../components/media/EmptyStateComp.jsx';
import { formatDate, humanizeMediaType } from '../utils/formatters.js';

export default function MediaDetailPage() {
  const { nasaId } = useParams();
  const { saved, recent, toggleSaved, addRecent, isSaved } = useLibrary();
  const localMedia = useMemo(() => [...saved, ...recent].find((item) => item.nasaId === nasaId), [saved, recent, nasaId]);
  const [media, setMedia] = useState(localMedia || null);
  const [assetUrl, setAssetUrl] = useState('');
  const [metadataUrl, setMetadataUrl] = useState('');
  const [metadataDocument, setMetadataDocument] = useState(null);
  const [captionUrl, setCaptionUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setAssetUrl('');
    setMetadataUrl('');
    setMetadataDocument(null);
    setCaptionUrl('');
    async function load() {
      try {
        let record = localMedia || null;
        try {
          const search = await searchMedia({ nasa_id: nasaId }, { pageSize: 1, signal: controller.signal });
          if (search.items[0]) record = search.items[0];
        } catch (searchError) {
          if (!record) throw searchError;
        }
        if (!record) throw new Error('This media item could not be found in the NASA archive.');
        if (controller.signal.aborted) return;
        setMedia(record);
        addRecent(record);

        const [manifest, metadata, captions] = await Promise.all([
          getAssetManifest(nasaId, { signal: controller.signal }).catch(() => null),
          getMediaMetadataDocument(nasaId, { signal: controller.signal }).catch(() => null),
          record.mediaType === 'video' ? getCaptions(nasaId, { signal: controller.signal }).catch(() => null) : Promise.resolve(null),
        ]);
        if (controller.signal.aborted) return;
        setAssetUrl(chooseMediaAsset(manifest, record.mediaType));
        setMetadataUrl(metadata?.location || '');
        setMetadataDocument(metadata?.data || null);
        setCaptionUrl(resolveLocation(captions));
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Unable to load media details.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  // localMedia is intentionally read when nasaId changes; addRecent updates the library context.
  }, [nasaId, addRecent]);

  const save = () => media && toggleSaved(media);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('This browser did not allow copying the link.');
    }
  };

  if (loading && !media) return <div className="detail-loading"><div className="detail-loading__visual"/><div className="skeleton-card__line skeleton-card__line--short"/><div className="skeleton-card__line"/></div>;
  if (error && !media) return <EmptyStateComp title="Media unavailable" description={error} actionLabel="Return to search" actionTo="/search" />;
  if (!media) return null;

  const savedState = isSaved(media.nasaId);

  return (
    <div className="media-detail-page page-enter">
      <div className="detail-topline"><Link to="/search" className="back-link"><ArrowLeft size={15} /> BACK TO EXPLORER</Link><div className="detail-topline__id">NASA MEDIA ID / {media.nasaId}</div></div>
      <div className="detail-layout">
        <section className="detail-main">
          <div className="detail-viewer-wrap"><div className="detail-viewer-label"><span>{humanizeMediaType(media.mediaType)} / ORIGINAL MEDIA</span><span>{media.center || 'NASA ARCHIVE'}</span></div><MediaPlayerComp media={media} assetUrl={assetUrl || (media.mediaType === 'image' ? media.preview : '')} captionUrl={captionUrl} /></div>
          <div className="detail-description"><span className="section-kicker">ABOUT THIS MEDIA</span><p>{media.description}</p>{media.description508 && <details className="detail-accessibility"><summary>Accessibility description</summary><p>{media.description508}</p></details>}</div>
          {media.keywords?.length > 0 && <div className="detail-keywords"><span className="section-kicker">KEYWORDS</span><div>{media.keywords.slice(0, 24).map((keyword) => <Link key={keyword} to={`/search?q=${encodeURIComponent(keyword)}`}>{keyword}</Link>)}</div></div>}
        </section>
        <aside className="detail-sidebar">
          <span className="section-kicker">NASA MEDIA ARCHIVE / ITEM</span>
          <h1>{media.title}</h1>
          <div className="detail-badges"><span>{humanizeMediaType(media.mediaType)}</span><span>{media.center || 'NASA'}</span></div>
          <div className="detail-actions">
            <button className={`button ${savedState ? 'button--saved' : 'button--primary'}`} type="button" onClick={save}><Bookmark size={15} fill={savedState ? 'currentColor' : 'none'} /> {savedState ? 'Saved to library' : 'Save media'}</button>
            <button className="button button--secondary" type="button" onClick={copyLink}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy link'}</button>
          </div>
          <div className="detail-metadata">
            <div className="detail-metadata__row"><CalendarDays size={15} /><div><span>DATE CREATED</span><strong>{formatDate(media.dateCreated)}</strong></div></div>
            {media.photographer && <div className="detail-metadata__row"><UserRound size={15} /><div><span>PHOTOGRAPHER</span><strong>{media.photographer}</strong></div></div>}
            {media.secondaryCreator && <div className="detail-metadata__row"><UserRound size={15} /><div><span>SECONDARY CREATOR</span><strong>{media.secondaryCreator}</strong></div></div>}
            {media.location && <div className="detail-metadata__row"><MapPin size={15} /><div><span>LOCATION</span><strong>{media.location}</strong></div></div>}
            <div className="detail-metadata__row"><FileJson size={15} /><div><span>NASA ID</span><strong>{media.nasaId}</strong></div></div>
            {media.credit && <div className="detail-credit"><span>CREDIT</span><p>{media.credit}</p></div>}
          </div>
          <div className="detail-source-links">
            {assetUrl && <a href={assetUrl} target="_blank" rel="noreferrer"><Download size={14} /> Open original asset <ArrowUpRight size={13} /></a>}
            {metadataUrl && <a href={metadataUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Technical metadata <ArrowUpRight size={13} /></a>}
            <a href={`https://images.nasa.gov/details/${encodeURIComponent(media.nasaId)}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> View in NASA Library <ArrowUpRight size={13} /></a>
          </div>
          {metadataDocument && <details className="detail-technical-data"><summary><FileJson size={14}/> Inspect technical metadata <span>{Object.keys(metadataDocument).length} fields</span></summary><div className="detail-technical-data__grid">{Object.entries(metadataDocument).slice(0, 48).map(([key, value]) => <div key={key}><span>{key.replaceAll('_', ' ')}</span><strong>{Array.isArray(value) ? value.join(', ') : typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '—')}</strong></div>)}</div></details>}
          {error && <div className="inline-error">{error}</div>}
        </aside>
      </div>
      <div className="detail-bottom-note">NASA media and metadata are presented from the public NASA Image and Video Library. Original credits remain with the source record.</div>
    </div>
  );
}
