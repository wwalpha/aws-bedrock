import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChatbotUISVG } from '@/components/icons/chatbotui-svg';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <Link to={ROUTES.HOME} aria-label="Chatbot UI Home" className="flex items-center gap-3">
          <ChatbotUISVG scale={0.15} />
          <span className="select-none text-lg font-semibold tracking-wide sm:text-xl">Chatbot UI</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
