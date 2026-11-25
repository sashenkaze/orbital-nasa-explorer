import { Bookmark, Trash2 } from 'lucide-react';
import MediaGridComp from '../components/media/MediaGridComp.jsx';
import EmptyStateComp from '../components/media/EmptyStateComp.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export default function SavedPage() {
  const { saved, toggleSaved } = useLibrary();
  return (
    <div className="library-page page-enter">
      <div className="page-heading"><div><span className="section-kicker">YOUR PERSONAL ARCHIVE / 03</span><h1>Saved for <em>later.</em></h1><p>A small collection of things you want to come back to.</p></div><span className="page-heading__index">LIBRARY<br />{String(saved.length).padStart(2, '0')} ITEMS</span></div>
      {saved.length === 0 ? <EmptyStateComp title="Your saved orbit is empty" description="Save photographs, videos, and audio from the archive. They will be kept in this browser." /> : <><div className="library-toolbar"><span><strong>{saved.length}</strong> saved items</span><button className="text-button" type="button" onClick={() => saved.forEach((item) => toggleSaved(item))}><Trash2 size={14} /> Clear saved items</button></div><MediaGridComp items={saved} /></>}
      <p className="local-storage-note"><Bookmark size={13} /> Saved items are stored locally in this browser and are not synced between devices.</p>
    </div>
  );
}
