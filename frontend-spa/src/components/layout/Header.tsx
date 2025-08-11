import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChatbotUISVG } from '@/components/icons/chatbotui-svg';

export function Header() {
  return (
    <header className="border-b bg-background/60 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={ROUTES.HOME} className="flex items-center">
            <ChatbotUISVG scale={0.15} />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to={ROUTES.HOME} className="hover:underline">
              Home
            </Link>
            <Link to={ROUTES.LOGIN} className="hover:underline">
              Login
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
