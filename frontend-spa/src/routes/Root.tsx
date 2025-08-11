import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export default function Root() {
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
