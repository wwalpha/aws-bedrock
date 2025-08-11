import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(false);
  // Initialize from localStorage or prefers-color-scheme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDark(false);
    }
  }, []);
  // Apply and persist on toggle
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);
  return (
    <Button variant="outline" size="sm" onClick={() => setDark((v) => !v)}>
      {dark ? 'Light' : 'Dark'}
    </Button>
  );
}
