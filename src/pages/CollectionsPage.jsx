import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COLLECTIONS } from '../utils/collections.js';
import { searchMedia } from '../services/nasaApi.js';
import AlbumLookupComp from '../components/media/AlbumLookupComp.jsx';

export default function CollectionsPage() {
  const [covers, setCovers] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    Promise.all(COLLECTIONS.map(async (collection) => {
      try {
        const result = await searchMedia({ q: collection.query, media_type: 'image' }, { pageSize: 2, signal: controller.signal });
        return [collection.slug, result.items[0]?.preview || ''];
      } catch {
        return [collection.slug, ''];
      }
    })).then((entries) => setCovers(Object.fromEntries(entries)));
    return () => controller.abort();
  }, []);

  return (
    <div className="collections-page page-enter">
      <div className="page-heading"><div><span className="section-kicker">CURATED ENTRY POINTS / 02</span><h1>Collections of <em>curiosity.</em></h1><p>Follow a mission, an instrument, or simply a question that keeps pulling you in.</p></div><span className="page-heading__index">COLLECTIONS<br />06 STORIES</span></div>
      <div className="collections-intro"><span>01—06</span><p>These collections are editorial starting points built from NASA archive search. Each one opens into live results from the original library.</p></div>
      <div className="collections-grid">
        {COLLECTIONS.map((collection, index) => (
          <Link to={`/collections/${collection.slug}`} key={collection.slug} className={`collection-card collection-card--${collection.accent}`} style={{ '--collection-index': index }}>
            <div className="collection-card__visual">
              {covers[collection.slug] ? <img src={covers[collection.slug]} alt="" loading="lazy" /> : <div className="collection-card__placeholder" />}
              <span className="collection-card__number">0{index + 1}</span>
              <span className="collection-card__arrow"><ArrowUpRight size={19} /></span>
            </div>
            <div className="collection-card__body"><span className="section-kicker">{collection.eyebrow}</span><h2>{collection.title}</h2><p>{collection.description}</p><span className="text-link">OPEN COLLECTION <ArrowRight size={14} /></span></div>
          </Link>
        ))}
      </div>
      <AlbumLookupComp />
      <div className="collection-note"><span className="section-kicker">A NOTE ON CURATION</span><p>Collection names and descriptions are created by ORBITAL. Media, metadata, and source files are retrieved from NASA when you open a collection.</p></div>
    </div>
  );
}
