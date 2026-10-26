export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';
  return <button type="button" className="dash-theme-toggle" role="switch" aria-label="Dark mode" aria-checked={dark} onClick={onToggle} title={`Switch to ${dark ? 'light' : 'dark'} mode`}>
    <span className="dash-theme-toggle__label dash-theme-toggle__label--light" aria-hidden="true">Light</span>
    <span className="dash-theme-toggle__track" aria-hidden="true">
      <span className="dash-theme-toggle__stars"><i /><i /><i /></span>
      <span className="dash-theme-toggle__knob"><span className="dash-theme-toggle__craters" /></span>
    </span>
    <span className="dash-theme-toggle__label dash-theme-toggle__label--dark" aria-hidden="true">Dark</span>
  </button>;
}
