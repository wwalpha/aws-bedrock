import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDark(isDark);
  }, []);
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);
  return (
    <Button variant="outline" size="sm" onClick={() => setDark((v) => !v)}>
      {dark ? 'Light' : 'Dark'}
    </Button>
  );
}
