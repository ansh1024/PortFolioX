import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/layout/ThemeToggle.jsx';
import LayoutIcon from '../components/layout/LayoutIcon.jsx';
import useDashboardTheme from '../hooks/useDashboardTheme.js';
import LoginCharacters, { LoginIntro } from '../components/auth/LoginCharacters.jsx';
import '../styles/dashboard.css';
import '../styles/auth.css';

export default function AuthLayout() {
  const { theme, toggleTheme } = useDashboardTheme();
  const { pathname } = useLocation();
  const main = useRef(null);
  const [interaction, setInteraction] = useState({ field: null, passwordVisible: false, hasPassword: false });
  const isLogin = pathname === '/login';
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${pathname === '/login' ? 'Sign in' : 'Registration'} — PortFolioX`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [pathname]);

  return <div className="auth-shell" data-theme={theme} data-page={isLogin ? 'login' : 'register'}>
    {isLogin && <LoginIntro />}
    <a href="#auth-content" className="skip-link">Skip to content</a>
    <header className="auth-header">
      <Link to="/" className="brand auth-brand" aria-label="PortFolioX home"><span className="brand__mark" aria-hidden="true"><i /><i /><i /></span><span>PortFolio<span className="brand__x">X</span></span></Link>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
    </header>
    <main id="auth-content" className="auth-main" ref={main} tabIndex={-1}>
      {isLogin ? <LoginCharacters interaction={interaction} /> : <aside className="auth-story" aria-labelledby="auth-story-title">
        <span className="auth-eyebrow">A LITTLE LESS NOISE.</span>
        <h2 id="auth-story-title">Your next chapter.<br />A clearer perspective<span>.</span></h2>
        <p>A thoughtful place for your investments,<br />and the reasoning behind them.</p>
        <ul className="auth-story__sections">
          <li><LayoutIcon name="ipo" /><span>Your next opportunity.</span><span>IPOs</span></li>
          <li><LayoutIcon name="funds" /><span>Your long-term view.</span><span>Funds & SIPs</span></li>
          <li><LayoutIcon name="journal" /><span>Your own point of view.</span><span>Journal</span></li>
        </ul>
        <div className="auth-story__closing"><LayoutIcon name="spark" size={36} /><span>Your investments.<br />Your point of view.</span></div>
      </aside>}
      <div className="auth-form-column"><Outlet context={{ onActivity: setInteraction }} /><Link to="/" className="auth-back-link"><LayoutIcon name="arrow" size={16} />Back to website</Link></div>
    </main>
    <footer className="auth-footer">PortFolioX · A little context. A better perspective.</footer>
  </div>;
}
