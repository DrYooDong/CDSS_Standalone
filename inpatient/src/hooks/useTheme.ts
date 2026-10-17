import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const urlParam = new URLSearchParams(window.location.search).get('theme');
      if (urlParam === 'dark' || urlParam === 'light') return urlParam;
      const saved = localStorage.getItem('cliniportal_theme') || localStorage.getItem('clinical_theme') || localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light'; // Default clinical light
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      if (document.body) {
        document.body.classList.add('dark');
        document.body.setAttribute('data-theme', 'dark');
      }
    } else {
      root.classList.remove('dark');
      if (document.body) {
        document.body.classList.remove('dark');
        document.body.setAttribute('data-theme', 'light');
      }
    }
    try {
      localStorage.setItem('cliniportal_theme', theme);
      localStorage.setItem('clinical_theme', theme);
      localStorage.setItem('theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Synchronize with shell events and cross-tab storage
  useEffect(() => {
    const handleShellTheme = (e: any) => {
      const next = e.detail?.theme;
      if (next === 'light' || next === 'dark') {
        setTheme(next);
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if ((e.key === 'cliniportal_theme' || e.key === 'clinical_theme' || e.key === 'theme') && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue as ThemeMode);
      }
    };
    window.addEventListener('cliniportal-theme-change', handleShellTheme);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('cliniportal-theme-change', handleShellTheme);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme, setTheme };
}

