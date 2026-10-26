import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';
import { dashboardSections, sectionUrl } from '../app/dashboardSections.js';
import '../styles/dashboard.css';
import useDashboardTheme from '../hooks/useDashboardTheme.js';

export default function DashboardLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useDashboardTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawer = useRef(null);
  const content = useRef(null);
  const section = dashboardSections.find(item => sectionUrl(item) === location.pathname.replace(/\/$/, ''));
  const title = section?.label || 'Page not found';
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuOpen && !drawer.current.open) drawer.current.showModal();
    if (!menuOpen && drawer.current.open) drawer.current.close();
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    content.current?.focus({ preventScroll: true });
    const previousTitle = document.title;
    document.title = `${title} — PortFolioX`;
    return () => { document.title = previousTitle; };
  }, [location.pathname, title]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 60rem)');
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', onResize);
    return () => desktop.removeEventListener('change', onResize);
  }, []);

  return <div className="dash-shell" data-theme={theme}>
    <a className="skip-link" href="#dashboard-content">Skip to content</a>
    <aside className="dash-desktop-sidebar"><Sidebar /></aside>
    <div className="dash-body">
      <Topbar title={title} onMenuOpen={() => setMenuOpen(true)} menuOpen={menuOpen} theme={theme} onThemeToggle={toggleTheme} />
      <main id="dashboard-content" className="dash-content" tabIndex={-1} ref={content}><Outlet /></main>
      <footer className="dash-footer"><span>PortFolioX</span><span>Your investments. Your point of view.</span></footer>
    </div>
    <dialog id="dashboard-navigation" ref={drawer} className="dash-drawer" aria-label="Workspace navigation" onCancel={closeMenu} onClose={closeMenu} onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
      <Sidebar onClose={closeMenu} onNavigate={closeMenu} />
    </dialog>
  </div>;
}
