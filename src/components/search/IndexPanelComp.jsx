import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, AudioLines, Image as ImageIcon, SlidersHorizontal, Video, X } from 'lucide-react';

const QUICK_TERMS = ['Apollo 11', 'James Webb', 'Mars', 'Earth from space', 'Hubble', 'Voyager'];
const MEDIA_OPTIONS = [
  { value: 'image', label: 'Images', icon: ImageIcon },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'audio', label: 'Audio', icon: AudioLines },
];

export default function IndexPanelComp({
  open = false,
  onClose,
  mediaType = '',
  activeFiltersCount = 0,
  onQuickSearch,
  onChooseMediaType,
  onRefine,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const panel = (
    <>
      <button
        className={`filter-backdrop ${open ? 'is-open' : ''}`}
        type="button"
        aria-label="Close index"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        className={`filter-panel filter-panel--drawer index-panel ${open ? 'is-open' : ''}`}
        aria-label="Discovery index"
        aria-hidden={!open}
        role="dialog"
        aria-modal={open}
      >
        <div className="filter-panel__header">
          <div className="filter-panel__topline">
            <span>ORBITAL / DISCOVERY INDEX</span>
            <button className="icon-button filter-panel__close" type="button" onClick={onClose} aria-label="Close index">
              <X size={17} />
            </button>
          </div>
          <div className="filter-panel__heading">
            <span className="section-kicker">START EXPLORING</span>
            <h3>Open the index.</h3>
            <p className="filter-panel__intro">Choose a thread to follow, or narrow the archive by format and catalogue details.</p>
          </div>
        </div>

        <div className="filter-panel__scroll">
          <div className="index-panel__sections">
            <section className="search-side-index__section search-side-index__section--routes">
              <div className="search-side-index__heading">
                <span>01 / ENTRY POINTS</span>
                <small>FOLLOW A THREAD</small>
              </div>
              <div className="search-side-index__routes">
                {QUICK_TERMS.map((term, index) => (
                  <button type="button" key={term} onClick={() => onQuickSearch(term)}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{term}</strong>
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
            </section>

            <section className="search-side-index__section search-side-index__section--formats">
              <div className="search-side-index__heading">
                <span>02 / FORMAT</span>
                <small>MEDIA TYPE</small>
              </div>
              <div className="search-side-index__formats">
                {MEDIA_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={value}
                    className={mediaType === value ? 'is-active' : ''}
                    aria-pressed={mediaType === value}
                    onClick={() => onChooseMediaType(mediaType === value ? '' : value)}
                  >
                    <Icon size={15} />
                    <span>{label}</span>
                    <i />
                  </button>
                ))}
              </div>
            </section>

            <section className="search-side-index__note">
              <span>03 / CATALOGUE</span>
              <p>Search across missions, places, people and the details captured along the way.</p>
              <button className={`filter-launch ${activeFiltersCount ? 'has-filters' : ''}`} type="button" onClick={onRefine}>
                <SlidersHorizontal size={14} />
                Refine archive
                <span>{activeFiltersCount || '＋'}</span>
              </button>
            </section>
          </div>
        </div>
      </aside>
    </>
  );

  return createPortal(panel, document.body);
}
