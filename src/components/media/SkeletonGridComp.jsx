export default function SkeletonGridComp({ count = 8 }) {
  return <div className="media-grid skeleton-grid" aria-label="Loading media">{Array.from({ length: count }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-card__image" /><div className="skeleton-card__line skeleton-card__line--short" /><div className="skeleton-card__line" /><div className="skeleton-card__line skeleton-card__line--medium" /></div>)}</div>;
}
