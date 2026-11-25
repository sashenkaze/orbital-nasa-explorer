export function formatDate(value) {
  if (!value) return 'DATE UNAVAILABLE';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function formatCount(value) {
  return new Intl.NumberFormat('en', { notation: value >= 10_000 ? 'compact' : 'standard' }).format(value || 0);
}

export function truncate(value, length = 150) {
  if (!value) return '';
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > length ? `${clean.slice(0, length).trimEnd()}…` : clean;
}

export function humanizeMediaType(value = '') {
  if (value === 'video') return 'VIDEO';
  if (value === 'audio') return 'AUDIO';
  return 'IMAGE';
}
