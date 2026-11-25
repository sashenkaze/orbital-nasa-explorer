import { History, Trash2 } from 'lucide-react';
import MediaGridComp from '../components/media/MediaGridComp.jsx';
import EmptyStateComp from '../components/media/EmptyStateComp.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export default function RecentPage() {
  const { recent, clearRecent } = useLibrary();
  return (
    <div className="library-page page-enter">
      <div className="page-heading"><div><span className="section-kicker">YOUR BROWSING HISTORY / 04</span><h1>Recently <em>visited.</em></h1><p>The media you've opened lately, gathered in one place.</p></div><span className="page-heading__index">HISTORY<br />{String(recent.length).padStart(2, '0')} ITEMS</span></div>
      {recent.length === 0 ? <EmptyStateComp title="No recent discoveries yet" description="Open a media item from the NASA archive and it will appear here." /> : <><div className="library-toolbar"><span><strong>{recent.length}</strong> recently viewed</span><button className="text-button" type="button" onClick={clearRecent}><Trash2 size={14} /> Clear history</button></div><MediaGridComp items={recent} /></>}
      <p className="local-storage-note"><History size={13} /> Your recent history is stored locally in this browser.</p>
    </div>
  );
}
