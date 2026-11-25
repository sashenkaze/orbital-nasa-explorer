import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import SidebarComp from './SidebarComp.jsx';
import TopbarComp from './TopbarComp.jsx';

export default function AppShellComp() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.search]);

  return (
    <div className="app-shell">
      <SidebarComp />
      <div className="app-shell__main">
        <TopbarComp />
        <main className="page-content" key={location.pathname + location.search}>
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>ORBITAL / SPACE MEDIA INDEX</span>
          <span>MEDIA & METADATA PROVIDED BY NASA</span>
        </footer>
      </div>
    </div>
  );
}
