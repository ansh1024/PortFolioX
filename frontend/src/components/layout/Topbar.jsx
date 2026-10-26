import LayoutIcon from './LayoutIcon.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Topbar({ title, onMenuOpen, menuOpen, theme, onThemeToggle }) {
  return <header className="dash-topbar">
    <div className="dash-topbar__title">
      <button className="dash-icon-button dash-menu-button" onClick={onMenuOpen} aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="dashboard-navigation"><LayoutIcon name="menu" /></button>
      <div><p className="dash-topbar__eyebrow">YOUR WORKSPACE</p><h1>{title}</h1></div>
    </div>
    <div className="dash-topbar__actions">
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      <div className="dash-profile" aria-label="Profile placeholder">
      <span className="dash-profile__avatar"><LayoutIcon name="profile" size={19} /></span>
      <span className="dash-profile__label">Profile<span>Coming soon</span></span>
      </div>
    </div>
  </header>;
}
