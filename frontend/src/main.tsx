import { StrictMode } from 'react';
import '@fontsource-variable/inter';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Verify from './routes/Verify';
import Workspace from './routes/Workspace';
import Home from './routes/Home';
import Root from './routes/Root';
import Demo from './routes/Demo';
import { Toaster } from '@/components/ui/toaster';
import { ROUTES } from '@/lib/routes';

// Ensure dark mode by default to match Next.js frontend Providers(defaultTheme="dark")
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  if (!root.classList.contains('dark')) {
    root.classList.add('dark');
  }
}

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.SIGNUP, element: <Signup /> },
      { path: ROUTES.VERIFY, element: <Verify /> },
      { path: ROUTES.DEMO, element: <Demo /> },
      { path: ROUTES.WORKSPACE, element: <Workspace /> },
      { path: ROUTES.WORKSPACE_CHAT, element: <Workspace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
);
