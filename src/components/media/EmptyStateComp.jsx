import { ArrowUpRight, Orbit, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyStateComp({ title = 'Nothing in this orbit yet', description = 'Try another search or adjust the filters to explore more of the NASA archive.', actionLabel = 'Explore the archive', actionTo = '/search' }) {
  return (
    <div className="empty-state">
      <div className="empty-state__symbol"><Orbit size={29} strokeWidth={1.25} /></div>
      <span className="section-kicker">SIGNAL NOT FOUND</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button button--secondary" to={actionTo}>{actionLabel} <ArrowUpRight size={15} /></Link>
    </div>
  );
}
