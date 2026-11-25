import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw, X } from 'lucide-react';

const CENTERS = ['JPL', 'JSC', 'KSC', 'GSFC', 'HQ', 'MSFC', 'LRC', 'ARC', 'AFRC', 'SSC', 'GRC'];
const MEDIA_TYPES = [
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
];

function Field({ label, hint, children }) {
  return <div className="filter-field"><span className="filter-field__label">{label}</span>{children}{hint && <small>{hint}</small>}</div>;
}

export default function FilterPanelComp({ filters, setFilters, onApply, onReset, open = false, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event) => { if (event.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const selectedTypes = filters.media_type ? filters.media_type.split(',').filter(Boolean) : [];
  const toggleMediaType = (value) => {
    const next = selectedTypes.includes(value) ? selectedTypes.filter((type) => type !== value) : [...selectedTypes, value];
    update('media_type', next.join(','));
  };

  const panel = (
    <>
      <button className={`filter-backdrop ${open ? 'is-open' : ''}`} type="button" aria-label="Close filters" tabIndex={open ? 0 : -1} onClick={onClose} />
      <aside className={`filter-panel filter-panel--drawer ${open ? 'is-open' : ''}`} aria-label="Archive filters" aria-hidden={!open} role="dialog" aria-modal={open}>
        <div className="filter-panel__header">
          <div className="filter-panel__topline"><span>ORBITAL / ARCHIVE FILTERS</span><button className="icon-button filter-panel__close" type="button" onClick={onClose} aria-label="Close filters"><X size={17} /></button></div>
          <div className="filter-panel__heading">
            <span className="section-kicker">NARROW THE COLLECTION</span>
            <h3>Filter the archive.</h3>
            <p className="filter-panel__intro">Combine catalog details to find a more specific record.</p>
          </div>
        </div>

        <div className="filter-panel__scroll">
          <div className="filter-panel__fields">
            <Field label="Media type" hint="Select one or more formats">
              <div className="filter-format-grid">
                {MEDIA_TYPES.map(({ value, label }) => (
                  <button type="button" key={value} className={selectedTypes.includes(value) ? 'is-selected' : ''} aria-pressed={selectedTypes.includes(value)} onClick={() => toggleMediaType(value)}>
                    <span className="filter-format-grid__check" />{label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Year range" hint="Inclusive creation years">
              <div className="filter-year-range">
                <input inputMode="numeric" maxLength={4} placeholder="From" value={filters.year_start} onChange={(event) => update('year_start', event.target.value.replace(/\D/g, '').slice(0, 4))} />
                <span>—</span>
                <input inputMode="numeric" maxLength={4} placeholder="To" value={filters.year_end} onChange={(event) => update('year_end', event.target.value.replace(/\D/g, '').slice(0, 4))} />
              </div>
            </Field>
            <Field label="NASA center">
              <select value={filters.center} onChange={(event) => update('center', event.target.value)}>
                <option value="">Any center</option>{CENTERS.map((center) => <option key={center} value={center}>{center}</option>)}
              </select>
            </Field>
            <Field label="Title contains"><input value={filters.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Saturn" /></Field>
            <Field label="Keywords" hint="Separate multiple terms with commas"><input value={filters.keywords} onChange={(event) => update('keywords', event.target.value)} placeholder="galaxy, telescope" /></Field>
            <Field label="Location"><input value={filters.location} onChange={(event) => update('location', event.target.value)} placeholder="e.g. Kennedy Space Center" /></Field>
            <details className="filter-advanced">
              <summary>More catalog fields <span>+</span></summary>
              <div className="filter-advanced__body">
                <Field label="Photographer"><input value={filters.photographer} onChange={(event) => update('photographer', event.target.value)} placeholder="Name or credit" /></Field>
                <Field label="Secondary creator"><input value={filters.secondary_creator} onChange={(event) => update('secondary_creator', event.target.value)} placeholder="Name or agency" /></Field>
                <Field label="Description contains"><input value={filters.description} onChange={(event) => update('description', event.target.value)} placeholder="Search description" /></Field>
                <Field label="Accessibility description"><input value={filters.description_508} onChange={(event) => update('description_508', event.target.value)} placeholder="Search 508 description" /></Field>
                <Field label="NASA ID"><input value={filters.nasa_id} onChange={(event) => update('nasa_id', event.target.value)} placeholder="Exact media ID" /></Field>
              </div>
            </details>
          </div>
        </div>

        <div className="filter-panel__actions">
          <button className="button button--primary button--block" type="button" onClick={onApply}>Apply filters</button>
          <button className="button button--quiet button--block" type="button" onClick={onReset}><RotateCcw size={14} /> Reset filters</button>
        </div>
      </aside>
    </>
  );

  return createPortal(panel, document.body);
}
