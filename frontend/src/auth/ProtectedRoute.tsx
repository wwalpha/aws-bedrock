import { JSX } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  console.log('VITE_AUTHORITY', import.meta.env);

  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
