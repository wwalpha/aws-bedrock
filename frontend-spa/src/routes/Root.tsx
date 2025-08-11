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
      <div className="bg-background text-foreground flex min-h-screen flex-col items-center overflow-x-auto">
        <main className="flex h-full w-full flex-1 items-center justify-center p-6">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="container grid flex-1 gap-4 p-4 md:grid-cols-[240px_1fr]">
        <Sidebar />
        <main className="rounded-lg border p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
