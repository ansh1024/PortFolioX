import { useEffect, useState } from 'react';

const storageKey = 'portfoliox-dashboard-theme';
const validTheme = value => value === 'light' || value === 'dark' ? value : null;

export default function useDashboardTheme() {
  const [preference, setPreference] = useState(() => {
    try { return validTheme(localStorage.getItem(storageKey)); }
    catch { return null; }
  });
  const [systemTheme, setSystemTheme] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const theme = preference || systemTheme;

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => setSystemTheme(media.matches ? 'dark' : 'light');
    const onStorageChange = event => {
      if (event.key === storageKey || event.key === null) setPreference(validTheme(event.newValue));
    };
    onSystemChange();
    media.addEventListener('change', onSystemChange);
    window.addEventListener('storage', onStorageChange);
    return () => {
      media.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setPreference(next);
    try { localStorage.setItem(storageKey, next); }
    catch { /* The switch still works when browser storage is unavailable. */ }
  }
  return { theme, toggleTheme };
}
