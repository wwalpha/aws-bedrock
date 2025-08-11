import { Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export default function Root() {
  const location = useLocation();
  const simpleLayout =
    location.pathname === ROUTES.HOME ||
    location.pathname === ROUTES.LOGIN ||
    location.pathname === ROUTES.SIGNUP ||
    location.pathname === ROUTES.VERIFY;

  if (simpleLayout) {
    // Match Next.js landing/login layout: centered content, no header/sidebar
    return (
      <div className="bg-background text-foreground flex h-dvh flex-col items-center overflow-x-auto">
        <main className="flex h-full w-full flex-1 items-center justify-center">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex-1 grid grid-cols-[350px_1fr] gap-0">
        <Sidebar />
        <main className="min-w-0 min-h-0 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
