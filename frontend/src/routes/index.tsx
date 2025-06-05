import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SecurePage from '../pages/SecurePage';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../auth/ProtectedRoute';
import { useAuth, LoginCallback } from '@/auth';
import { Dashboard } from '@/components/ui/dashboard';

const AppRoutes = () => {
  const { isLoading, isLoggedIn, signinRedirect, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      console.log('Redirecting to login page...');
      signinRedirect();
    }
  }, [isLoading, isLoggedIn, signinRedirect]);

  if (isLoading) return <p>認証情報を確認中...</p>;

  if (!isAuthenticated) {
    return <div>ログインページにリダイレクト中...</div>;
  }

  return (
    <BrowserRouter>
      <Dashboard>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<LoginCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Dashboard>
    </BrowserRouter>
  );
};
export default AppRoutes;
