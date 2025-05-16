import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SecurePage from '../pages/SecurePage';
import LoginCallback from '../pages/LoginCallback';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../auth/ProtectedRoute';
import { useAuth } from '@auth/useAuth';

const AppRoutes = () => {
  const { isLoading, isLoggedIn, signinRedirect, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('isLoading:', isLoading);
    console.log('isLoggedIn:', isLoggedIn);

    if (!isLoading && !isLoggedIn) {
      console.log('Redirecting to login page...');
      // ログインしてなければ自動的にログインページ（OIDCプロバイダ）へリダイレクト
      signinRedirect();
    }
  }, [isLoading, isLoggedIn, signinRedirect]);

  if (isLoading) return <p>認証情報を確認中...</p>;

  if (!isAuthenticated) {
    return <div>ログインページにリダイレクト中...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<LoginCallback />} />
        <Route
          path="/secure"
          element={
            <ProtectedRoute>
              <SecurePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
