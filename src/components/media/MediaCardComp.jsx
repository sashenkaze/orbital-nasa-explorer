import { ArrowUpRight, Bookmark, Film, Headphones, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../../context/LibraryContext.jsx';
import { formatDate, humanizeMediaType, truncate } from '../../utils/formatters.js';

function TypeIcon({ type }) {
  if (type === 'video') return <Film size={13} />;
  if (type === 'audio') return <Headphones size={13} />;
  return <ImageIcon size={13} />;
}

export default function MediaCardComp({ media, index = 0, variant = 'grid' }) {
  const { toggleSaved, isSaved } = useLibrary();
  const saved = isSaved(media.nasaId);
  const detailUrl = `/media/${encodeURIComponent(media.nasaId)}`;

  if (variant === 'list') {
    return (
      <article className="media-row" style={{ '--card-index': index }}>
        <Link to={detailUrl} className="media-row__image">
          {media.preview ? <img src={media.preview} alt="" loading="lazy" /> : <div className="media-image-fallback"><TypeIcon type={media.mediaType} /></div>}
        </Link>
        <div className="media-row__body">
          <div className="media-card__eyebrow"><span><TypeIcon type={media.mediaType} /> {humanizeMediaType(media.mediaType)}</span><span>{media.center || 'NASA ARCHIVE'}</span></div>
          <Link to={detailUrl} className="media-row__title">{media.title}</Link>
          <p>{truncate(media.description, 180)}</p>
          <div className="media-row__meta"><span>{formatDate(media.dateCreated)}</span><span>NASA ID / {media.nasaId}</span></div>
        </div>
        <button className={`icon-button media-card__save ${saved ? 'is-saved' : ''}`} onClick={() => toggleSaved(media)} aria-label={saved ? 'Remove saved media' : 'Save media'} title={saved ? 'Remove from saved' : 'Save media'}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /></button>
      </article>
    );
  }

  return (
    <article className="media-card" style={{ '--card-index': index }}>
      <div className="media-card__visual">
        <Link to={detailUrl} className="media-card__image-link" aria-label={`Open ${media.title}`}>
          {media.preview ? <img src={media.preview} alt={media.title} loading="lazy" /> : <div className="media-image-fallback"><TypeIcon type={media.mediaType} /></div>}
        </Link>
        <div className="media-card__visual-top">
          <span className="media-type"><TypeIcon type={media.mediaType} /> {humanizeMediaType(media.mediaType)}</span>
          <button className={`icon-button media-card__save ${saved ? 'is-saved' : ''}`} onClick={() => toggleSaved(media)} aria-label={saved ? 'Remove saved media' : 'Save media'} title={saved ? 'Remove from saved' : 'Save media'}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /></button>
        </div>
        <Link to={detailUrl} className="media-card__open"><ArrowUpRight size={16} /></Link>
      </div>
      <div className="media-card__content">
        <div className="media-card__meta"><span>{media.center || 'NASA ARCHIVE'}</span><span>{formatDate(media.dateCreated)}</span></div>
        <Link to={detailUrl} className="media-card__title">{media.title}</Link>
        <p className="media-card__description">{truncate(media.description, 118)}</p>
        <div className="media-card__id">{media.nasaId}</div>
      </div>
    </article>
  );
}
