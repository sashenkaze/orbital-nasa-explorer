import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getCollection } from '../utils/collections.js';
import { searchMedia } from '../services/nasaApi.js';
import MediaGridComp from '../components/media/MediaGridComp.jsx';
import SkeletonGridComp from '../components/media/SkeletonGridComp.jsx';
import EmptyStateComp from '../components/media/EmptyStateComp.jsx';

export default function CollectionDetailPage() {
  const { slug } = useParams();
  const collection = getCollection(slug);
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!collection) return undefined;
    const controller = new AbortController();
    setLoading(true);
    setItems([]);
    setError('');
    searchMedia({ q: collection.query }, { page: 1, signal: controller.signal })
      .then((result) => { setItems(result.items); setTotalHits(result.totalHits); setHasMore(result.hasMore); })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [collection]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = Math.ceil(items.length / 36) + 1;
    setLoadingMore(true);
    try {
      const result = await searchMedia({ q: collection.query }, { page: nextPage });
      setItems((current) => {
        const seen = new Set(current.map((item) => item.nasaId));
        return [...current, ...result.items.filter((item) => !seen.has(item.nasaId))];
      });
      setTotalHits(result.totalHits);
      setHasMore(result.hasMore);
      setSearchParams({ page: String(nextPage) }, { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoadingMore(false); }
  };

  if (!collection) return <EmptyStateComp title="Collection not found" description="This collection may have moved or no longer exists." actionLabel="Browse collections" actionTo="/collections" />;

  return (
    <div className="collection-detail-page page-enter">
      <Link to="/collections" className="back-link"><ArrowLeft size={15} /> ALL COLLECTIONS</Link>
      <div className="collection-detail-hero"><div><span className="section-kicker">{collection.eyebrow}</span><h1>{collection.title}</h1><p>{collection.description}</p><div className="collection-detail-hero__meta"><span>LIVE NASA SEARCH</span><span>{totalHits.toLocaleString('en')} MATCHING ITEMS</span></div></div><div className={`collection-detail-hero__orbit collection-detail-hero__orbit--${collection.accent}`}><div className="orbit-ring orbit-ring--a"/><div className="orbit-ring orbit-ring--b"/><div className="orbit-core"/><span>0{(collection.slug.length % 6) + 1}</span></div></div>
      <div className="collection-results-heading"><div><span className="section-kicker">FROM THE NASA LIBRARY</span><h2>Explore the archive.</h2></div><Link className="text-link" to={`/search?q=${encodeURIComponent(collection.query)}`}>Open in search <ArrowUpRight size={14} /></Link></div>
      {error && <div className="inline-error">{error}</div>}
      {loading && <SkeletonGridComp />}
      {!loading && !error && items.length === 0 && <EmptyStateComp title="This collection returned no media" description="Try searching the archive directly with a different term." />}
      {!loading && items.length > 0 && <><MediaGridComp items={items} />{hasMore && <div className="results-pagination"><span>{items.length.toLocaleString('en')} of {totalHits.toLocaleString('en')} items loaded</span><button className="button button--secondary" type="button" onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading...' : 'Load more media'}</button></div>}</>}
    </div>
  );
}
