import React, { useEffect } from 'react';
import { useAuth } from '@auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@store';

const LoginCallback: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const setAuthInfo = useStore((state) => state.setAuthInfo);

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.isAuthenticated && auth.user) {
      setAuthInfo(auth.user, auth.accessToken, auth.idToken);
      navigate('/', { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, auth.accessToken, auth.idToken, setAuthInfo, navigate]);

  if (auth.isLoading) return <div>認証処理中...</div>;
  if (auth.error) return <div>認証エラー: {auth.error.message}</div>;

  return <div>認証完了、リダイレクト中...</div>;
};

export default LoginCallback;
