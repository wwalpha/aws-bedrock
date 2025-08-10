import { Link, Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <nav className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <main className="p-6 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
