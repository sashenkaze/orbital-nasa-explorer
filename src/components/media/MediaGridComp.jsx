import MediaCardComp from './MediaCardComp.jsx';

export default function MediaGridComp({ items = [], view = 'grid', className = '' }) {
  if (view === 'list') {
    return <div className="media-list">{items.map((item, index) => <MediaCardComp key={item.nasaId} media={item} index={index} variant="list" />)}</div>;
  }
  return <div className={`media-grid ${className}`.trim()}>{items.map((item, index) => <MediaCardComp key={item.nasaId} media={item} index={index} />)}</div>;
}
