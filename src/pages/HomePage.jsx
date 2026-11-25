import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StarfieldComp from '../components/layout/StarfieldComp.jsx';
import BrandComp from '../components/layout/BrandComp.jsx';
import ThemeToggleComp from '../components/layout/ThemeToggleComp.jsx';
import { searchMedia } from '../services/nasaApi.js';
import { COLLECTIONS } from '../utils/collections.js';
import { formatDate, truncate } from '../utils/formatters.js';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    Promise.all(COLLECTIONS.slice(0, 3).map(async (collection) => {
      try {
        const result = await searchMedia({ q: collection.query, media_type: 'image' }, { pageSize: 4, signal: controller.signal });
        return { collection, items: result.items };
      } catch (error) {
        if (error.name === 'AbortError') throw error;
        return { collection, items: [] };
      }
    })).then(setFeatured).catch((error) => {
      if (error.name !== 'AbortError') setFeatured([]);
    }).finally(() => setFeaturedLoading(false));
    return () => controller.abort();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const scrollToArchive = () => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="home-page">
      <section className="home-hero" aria-label="ORBITAL introduction">
        <div className="home-hero__ambient home-hero__ambient--one" />
        <div className="home-hero__ambient home-hero__ambient--two" />
        <StarfieldComp density={1.05} />
        <header className="home-nav">
          <BrandComp light />
          <nav className="home-nav__links" aria-label="Primary navigation">
            <a href="#discover" onClick={(event) => { event.preventDefault(); scrollToArchive(); }}>Discover</a>
            <Link to="/collections">Collections</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="home-nav__actions"><ThemeToggleComp /><Link to="/search" className="home-nav__enter">Enter archive <ArrowUpRight size={14} /></Link></div>
        </header>

        <div className="home-hero__content">
          <div className="hero-eyebrow"><span className="hero-eyebrow__line" /> A NASA MEDIA EXPERIENCE <span className="hero-eyebrow__line" /></div>
          <h1 className="home-hero__title">Somewhere between<br /><em>curiosity</em> and infinity.</h1>
          <p className="home-hero__subtitle">Millions of moments. One universe to explore.</p>
          <form className="hero-search glass-panel" onSubmit={submit} role="search">
            <Search size={19} strokeWidth={1.65} />
            <input aria-label="Search NASA media" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" />
            <button type="submit" aria-label="Search"><span>Explore</span><ArrowUpRight size={16} /></button>
          </form>
          <div className="hero-search__suggestions">
            <span>TRY EXPLORING</span>
            {['Apollo 11', 'James Webb', 'Mars', 'Earth'].map((suggestion) => <button key={suggestion} type="button" onClick={() => navigate(`/search?q=${encodeURIComponent(suggestion)}`)}>{suggestion}</button>)}
          </div>
        </div>

        <button className="home-hero__scroll" type="button" onClick={scrollToArchive}>
          <span className="home-hero__scroll-icon"><ArrowDown size={15} /></span>
          <span>SCROLL TO EXPLORE</span>
        </button>
        <div className="home-hero__coordinates">29° 33' 00" N <span>·</span> 95° 05' 24" W</div>
        <div className="home-hero__index">01 <span>/</span> 03</div>
      </section>

      <section className="home-discover" id="discover">
        <div className="home-section-heading reveal-on-scroll">
          <div><span className="section-kicker">A UNIVERSE OF STORIES / 01</span><h2>Begin anywhere.</h2></div>
          <p>The NASA archive is vast. These starting points make it a little easier to find your way through.</p>
        </div>

        <div className="home-featured-grid">
          {COLLECTIONS.slice(0, 3).map((collection, index) => {
            const item = featured.find((entry) => entry.collection.slug === collection.slug)?.items?.[0];
            return (
              <Link to={`/collections/${collection.slug}`} className={`home-feature-card home-feature-card--${collection.accent}`} key={collection.slug} style={{ '--feature-index': index }}>
                <div className="home-feature-card__image-wrap">
                  {item?.preview ? <img src={item.preview} alt={item.title} loading="lazy" /> : <div className="home-feature-card__placeholder"><Sparkles size={25} /></div>}
                  <span className="home-feature-card__number">0{index + 1}</span>
                  <span className="home-feature-card__arrow"><ArrowUpRight size={19} /></span>
                </div>
                <div className="home-feature-card__body">
                  <span className="section-kicker">{collection.eyebrow}</span>
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                  <span className="home-feature-card__link">EXPLORE COLLECTION <ArrowRight size={13} /></span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="home-lower-band">
          <div className="home-lower-band__copy"><span className="section-kicker">THE COLLECTION IS YOURS TO EXPLORE</span><h2>Not just the famous moments.</h2><p>Find mission documentation, everyday work in space, scientific observations, and the details in between.</p><Link className="text-link" to="/search">Explore the full archive <ArrowUpRight size={15} /></Link></div>
          <div className="home-lower-band__visual"><div className="home-lower-band__orbit home-lower-band__orbit--one"/><div className="home-lower-band__orbit home-lower-band__orbit--two"/><div className="home-lower-band__planet"/><span>SPACE / HUMANITY / DISCOVERY</span></div>
        </div>

        <div className="home-all-collections"><div><span className="section-kicker">MORE WAYS IN</span><h2>Choose your horizon.</h2></div><Link className="text-link" to="/collections">All collections <ArrowUpRight size={15} /></Link></div>
        <div className="home-collection-links">{COLLECTIONS.slice(3).map((collection, index) => <Link to={`/collections/${collection.slug}`} key={collection.slug}><span>0{index + 4}</span><strong>{collection.title}</strong><ArrowUpRight size={15} /></Link>)}</div>
        {featuredLoading && <div className="home-loading-note"><span className="loading-dot" /> Preparing featured collections...</div>}
      </section>

      <footer className="home-footer"><BrandComp /><span>AN INDEPENDENT EXPLORER OF NASA'S PUBLIC MEDIA ARCHIVE</span><a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">VISIT NASA LIBRARY <ArrowUpRight size={13} /></a></footer>
    </div>
  );
}
