import { ArrowUpRight, Bookmark, Compass, History, Images, Info, Menu, Orbit, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import BrandComp from './BrandComp.jsx';

const exploreItems = [
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/collections', label: 'Collections', icon: Images },
];
const libraryItems = [
  { to: '/saved', label: 'Saved media', icon: Bookmark },
  { to: '/recent', label: 'Recently viewed', icon: History },
];

function NavigationLink({ to, label, icon: Icon, index, currentPath, onClick }) {
  const isExplore = to === '/explore' && (currentPath === '/search' || currentPath === '/explore');
  return (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => `sidebar__link ${isActive || isExplore ? 'is-active' : ''}`}>
      <span className="sidebar__link-index">{index}</span>
      <Icon size={16} strokeWidth={1.7} />
      <span className="sidebar__link-label">{label}</span>
      <ArrowUpRight className="sidebar__link-arrow" size={13} />
    </NavLink>
  );
}

export default function SidebarComp() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const close = () => setOpen(false);

  const nav = (
    <>
      <div className="sidebar__brand-row">
        <BrandComp />
        <button className="icon-button sidebar__close" type="button" onClick={close} aria-label="Close navigation"><X size={18} /></button>
      </div>

      <div className="sidebar__masthead">
        <span>FIELD GUIDE / 01</span>
        <small>AN INDEX OF SPACE</small>
      </div>

      <section className="sidebar__group">
        <div className="sidebar__section-label"><span>01</span> EXPLORE</div>
        <nav className="sidebar__nav" aria-label="Explore navigation">
          {exploreItems.map((item, index) => <NavigationLink key={item.to} {...item} index={`0${index + 1}`} currentPath={location.pathname} onClick={close} />)}
        </nav>
      </section>

      <section className="sidebar__group sidebar__group--library">
        <div className="sidebar__section-label"><span>02</span> YOUR LIBRARY</div>
        <nav className="sidebar__nav" aria-label="Your library">
          {libraryItems.map((item, index) => <NavigationLink key={item.to} {...item} index={`0${index + 3}`} currentPath={location.pathname} onClick={close} />)}
        </nav>
      </section>

      <div className="sidebar__lower">
        <NavLink to="/about" onClick={close} className={({ isActive }) => `sidebar__about-link ${isActive ? 'is-active' : ''}`}>
          <Info size={15} /><span>About this archive</span><ArrowUpRight size={13} />
        </NavLink>
        <div className="sidebar__footer">
          <div className="sidebar__footer-mark"><Orbit size={14} /><span>ORBITAL / FIELD NOTES</span></div>
          <p>An independent window into NASA's public media archive.</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button className="mobile-menu-button icon-button" type="button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
      <div className={`sidebar-backdrop ${open ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        {nav}
      </aside>
    </>
  );
}
