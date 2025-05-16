import React from 'react';
import { AuthProvider } from '@auth/AuthProvider';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
