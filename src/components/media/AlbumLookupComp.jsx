import { useState } from 'react';
import { ArrowUpRight, Database, Search } from 'lucide-react';
import { getAlbum } from '../../services/nasaApi.js';
import MediaGridComp from './MediaGridComp.jsx';
import SkeletonGridComp from './SkeletonGridComp.jsx';

export default function AlbumLookupComp() {
  const [name, setName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [items, setItems] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (event) => {
    event.preventDefault();
    const value = name.trim();
    if (!value) return;
    setLoading(true); setError(''); setItems([]); setPage(1); setAlbumName(value);
    try {
      const result = await getAlbum(value, { page: 1 });
      setItems(result.items); setTotalHits(result.totalHits); setHasMore(result.hasMore);
    } catch (err) { setError(err.message || 'Could not retrieve this NASA album. Check its exact case-sensitive name.'); }
    finally { setLoading(false); }
  };
  const nextPage = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true); setError('');
    try {
      const next = page + 1;
      const result = await getAlbum(albumName, { page: next });
      setItems((current) => { const ids = new Set(current.map((item) => item.nasaId)); return [...current, ...result.items.filter((item) => !ids.has(item.nasaId))]; });
      setPage(next); setHasMore(result.hasMore); setTotalHits(result.totalHits);
    } catch (err) { setError(err.message || 'Could not load the next album page.'); }
    finally { setLoadingMore(false); }
  };

  return <section className="album-lookup">
    <div className="album-lookup__intro"><span className="section-kicker">NASA ALBUMS / 05</span><h2>Open a NASA <i>album.</i></h2><p>Look up an original NASA media album by its exact, case-sensitive album name. This is separate from ORBITAL's curated collections.</p></div>
    <form className="album-lookup__form" onSubmit={lookup}><Database size={17}/><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Exact album name, e.g. apollo" aria-label="NASA album name"/><button className="button button--primary" type="submit" disabled={loading}>{loading ? 'Looking up…' : <>Open album <ArrowUpRight size={14}/></>}</button></form>
    <div className="album-lookup__hint"><span>EXACT ALBUM NAME REQUIRED</span><span>Names are case-sensitive</span></div>
    {error && <div className="inline-error" role="alert">{error}</div>}
    {loading && <SkeletonGridComp/>}
    {!loading && albumName && items.length > 0 && <><div className="album-lookup__result-head"><div><span className="section-kicker">NASA ALBUM / {albumName}</span><h3>{totalHits.toLocaleString()} records</h3></div><span>{items.length.toLocaleString()} loaded</span></div><MediaGridComp items={items}/>{hasMore && <div className="results-pagination"><span>Page {page}</span><button className="button button--secondary" type="button" onClick={nextPage} disabled={loadingMore}>{loadingMore ? 'Loading…' : 'Load next album page'}</button></div>}</>}
    {!loading && albumName && !items.length && !error && <p className="album-lookup__empty">This album returned no records.</p>}
  </section>;
}
