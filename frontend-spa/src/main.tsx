import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './routes/Login';
import Root from './routes/Root';
import Demo from './routes/Demo';
import { Toaster } from '@/components/ui/toaster';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/demo', element: <Demo /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <RouterProvider router={router} />
  <Toaster />
  </StrictMode>
);
