import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownWideNarrow, ArrowUpRight, AudioLines, Grid2X2, Image as ImageIcon, List, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import FilterPanelComp from '../components/search/FilterPanelComp.jsx';
import IndexPanelComp from '../components/search/IndexPanelComp.jsx';
import MediaGridComp from '../components/media/MediaGridComp.jsx';
import SkeletonGridComp from '../components/media/SkeletonGridComp.jsx';
import EmptyStateComp from '../components/media/EmptyStateComp.jsx';
import { searchMedia } from '../services/nasaApi.js';
import { formatCount } from '../utils/formatters.js';

const EMPTY_FILTERS = {
  q: '', media_type: '', year_start: '', year_end: '', center: '', title: '', description: '',
  keywords: '', location: '', photographer: '', secondary_creator: '', description_508: '', nasa_id: '',
};
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
];

function filtersFromParams(params) {
  return Object.keys(EMPTY_FILTERS).reduce((acc, key) => ({ ...acc, [key]: params.get(key) || '' }), {});
}
function buildParams(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => { if (String(value || '').trim()) params.set(key, String(value).trim()); });
  return params;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [items, setItems] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('relevance');
  const [filterOpen, setFilterOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const closeFilters = useCallback(() => setFilterOpen(false), []);
  const closeIndex = useCallback(() => setIndexOpen(false), []);
  const criteria = useMemo(() => filtersFromParams(searchParams), [searchParams]);
  const queryActive = Object.values(criteria).some((value) => value.trim());
  const activeFilters = Object.entries(criteria).filter(([key, value]) => key !== 'q' && value.trim());
  const activeSort = SORT_OPTIONS.find((option) => option.value === sort) || SORT_OPTIONS[0];

  useEffect(() => {
    setFilters(criteria);
    setItems([]);
    setTotalHits(0);
    setError('');
    if (!queryActive) { setLoading(false); setHasMore(false); return undefined; }
    const controller = new AbortController();
    setLoading(true);
    searchMedia(criteria, { page: 1, signal: controller.signal })
      .then((result) => { setItems(result.items); setTotalHits(result.totalHits); setHasMore(result.hasMore); })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message || 'The archive could not be reached.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [criteria, queryActive]);

  const sortedItems = useMemo(() => {
    if (sort === 'relevance') return items;
    return [...items].sort((a, b) => {
      if (sort === 'title-asc') return a.title.localeCompare(b.title);
      if (sort === 'title-desc') return b.title.localeCompare(a.title);
      const aDate = new Date(a.dateCreated || 0).getTime();
      const bDate = new Date(b.dateCreated || 0).getTime();
      return sort === 'oldest' ? aDate - bDate : bDate - aDate;
    });
  }, [items, sort]);

  const apply = () => {
    const start = Number(filters.year_start); const end = Number(filters.year_end);
    if (filters.year_start && filters.year_end && start > end) { setError('The start year must be earlier than or equal to the end year.'); return; }
    const next = buildParams(filters);
    if (!next.size) { setError('Enter a search term or choose at least one filter.'); return; }
    setError(''); setSearchParams(next); setFilterOpen(false);
  };
  const reset = () => { const next = { ...EMPTY_FILTERS, q: filters.q }; setFilters(next); setSearchParams(buildParams(next)); setFilterOpen(false); };
  const runQuickSearch = (value) => { const next = { ...EMPTY_FILTERS, q: value }; setFilters(next); setSearchParams(buildParams(next)); };
  const chooseIndexQuickSearch = (value) => { runQuickSearch(value); setIndexOpen(false); };
  const openAdvancedFilters = () => { setIndexOpen(false); setFilterOpen(true); };
  const chooseMediaType = (value) => {
    const next = { ...filters, media_type: value };
    setFilters(next);
    setError('');
    setSearchParams(buildParams(next));
  };
  const cycleSort = () => {
    const currentIndex = SORT_OPTIONS.findIndex((option) => option.value === sort);
    setSort(SORT_OPTIONS[(currentIndex + 1) % SORT_OPTIONS.length].value);
  };
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true); setError('');
    try {
      const result = await searchMedia(criteria, { page: Math.floor(items.length / 36) + 1 });
      setItems((current) => { const seen = new Set(current.map((item) => item.nasaId)); return [...current, ...result.items.filter((item) => !seen.has(item.nasaId))]; });
      setTotalHits(result.totalHits); setHasMore(result.hasMore);
    } catch (err) { setError(err.message || 'The next page could not be loaded.'); }
    finally { setLoadingMore(false); }
  };
  const submitSearch = (event) => { event.preventDefault(); apply(); };
  const clearQuery = () => { const next = { ...filters, q: '' }; setFilters(next); if (activeFilters.length) setSearchParams(buildParams(next)); else setSearchParams({}); };

  return (
    <div className="search-page search-page--fieldnotes page-enter">
      <div className="search-masthead">
        <div className="search-masthead__copy">
          <span className="section-kicker"><span className="live-dot" /> NASA IMAGE & VIDEO LIBRARY / FIELD INDEX 01</span>
          <h1>Explore the <i>archive.</i></h1>
          <p>A working atlas of photographs, moving images and recorded moments from beyond Earth.</p>
        </div>
        <div className="search-masthead__orbit" aria-hidden="true"><span>NASA</span><i /><b>01</b></div>
      </div>

      <form className="archive-search archive-search--command" onSubmit={submitSearch} role="search">
        <span className="archive-search__index">FIND /</span><Search size={19} />
        <input value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} placeholder="Search a mission, place, instrument, person..." aria-label="Search NASA media" />
        {filters.q && <button type="button" className="icon-button archive-search__clear" onClick={clearQuery} aria-label="Clear search"><X size={15} /></button>}
        <button type="submit" className="button button--primary">Search <ArrowUpRight size={15} /></button>
      </form>

      <div className="search-explorer-layout">
        <section className="search-results search-results--atlas" aria-live="polite">
          <div className="results-toolbar results-toolbar--atlas">
            <div className="results-toolbar__left">
              <button className="index-launch" type="button" onClick={() => setIndexOpen(true)} aria-label="Open discovery index" aria-haspopup="dialog" aria-expanded={indexOpen}>
                <SlidersHorizontal size={14} />
                <span>INDEX</span>
                {activeFilters.length > 0 && <b>{activeFilters.length}</b>}
              </button>
              <div className="results-count">{queryActive ? <><strong>{formatCount(totalHits)}</strong> records <span>·</span> {formatCount(items.length)} loaded</> : 'THE OPEN INDEX / BROWSE THE COLLECTION'}</div>
            </div>
            <div className="results-toolbar__right">
              <button className="order-control" type="button" onClick={cycleSort} title="Change result order" aria-label={`Change result order. Current order: ${activeSort.label}`}>
                <ArrowDownWideNarrow size={15} />
                <span><small>ORDER</small><strong>{activeSort.label}</strong></span>
              </button>
              <div className="view-toggle" aria-label="Result layout"><button type="button" className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-label="Grid view"><Grid2X2 size={16}/></button><button type="button" className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="List view"><List size={17}/></button></div>
            </div>
          </div>
          {activeFilters.length > 0 && <div className="active-filter-rail"><span>ACTIVE CONDITIONS</span>{activeFilters.map(([key, value]) => <button type="button" key={key} onClick={() => { const next = { ...filters, [key]: '' }; setFilters(next); setSearchParams(buildParams(next)); }}>{key.replaceAll('_', ' ')}: {value}<X size={11}/></button>)}</div>}
          {error && <div className="inline-error" role="alert"><span>{error}</span><button className="icon-button" type="button" onClick={() => setError('')} aria-label="Dismiss error"><X size={15}/></button></div>}
          {loading && <SkeletonGridComp/>}
          {!loading && !queryActive && <div className="index-intro">
            <div className="index-intro__main"><span className="section-kicker">NO QUERY REQUIRED / OPEN EXPLORATION</span><h2>Start anywhere.<br/><i>Stay curious.</i></h2><p>There is no correct route through the archive. Follow a mission, a planet, a camera, or a passing thought.</p><div className="index-intro__links"><button onClick={() => runQuickSearch('Apollo 11')} type="button"><span>01</span> Human spaceflight <ArrowUpRight size={14}/></button><button onClick={() => runQuickSearch('James Webb Space Telescope')} type="button"><span>02</span> Deep field observations <ArrowUpRight size={14}/></button><button onClick={() => runQuickSearch('Mars rover')} type="button"><span>03</span> Surface exploration <ArrowUpRight size={14}/></button></div></div>
            <div className="index-intro__side"><div className="index-intro__glyph"><div className="index-orbit index-orbit--one"/><div className="index-orbit index-orbit--two"/><div className="index-orbit__planet"/></div><span><Sparkles size={13}/> A LIVING INDEX</span><small>Images · Video · Audio</small></div>
          </div>}
          {!loading && queryActive && !error && items.length === 0 && <EmptyStateComp title="No matching records" description="Try a broader phrase, remove a condition, or explore a featured collection."/>}
          {!loading && items.length > 0 && <><div className="atlas-result-note"><span><ImageIcon size={13}/> VISUAL RECORDS</span><span><AudioLines size={13}/> IMAGES, FILM & SOUND</span><span>NASA PUBLIC ARCHIVE</span></div><MediaGridComp items={sortedItems} view={view} className="media-grid--uniform"/><div className="results-pagination"><span>Showing <strong>{formatCount(items.length)}</strong> of <strong>{formatCount(totalHits)}</strong> records</span>{hasMore && <button className="button button--secondary" type="button" onClick={loadMore} disabled={loadingMore}>{loadingMore ? <><span className="button-spinner"/> Loading...</> : 'Load next page'}</button>}</div></>}
        </section>
      </div>

      <IndexPanelComp
        open={indexOpen}
        onClose={closeIndex}
        mediaType={criteria.media_type}
        activeFiltersCount={activeFilters.length}
        onQuickSearch={chooseIndexQuickSearch}
        onChooseMediaType={chooseMediaType}
        onRefine={openAdvancedFilters}
      />
      <FilterPanelComp filters={filters} setFilters={setFilters} onApply={apply} onReset={reset} open={filterOpen} onClose={closeFilters} />
    </div>
  );
}
