import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'ehealth_theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
};
