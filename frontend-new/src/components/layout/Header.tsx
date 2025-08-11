import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  return (
    <header className="border-b bg-background/60 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <nav className="flex items-center gap-4 text-sm">
          <Link to={ROUTES.HOME} className="hover:underline">
            Home
          </Link>
          <Link to={ROUTES.LOGIN} className="hover:underline">
            Login
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
