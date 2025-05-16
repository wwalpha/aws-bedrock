import { useAuth as useOidcAuth } from 'react-oidc-context';

/**
 * アプリケーション全体で使う認証フック。
 * 例えばカスタムロジックを追加したり、useOidcAuth の戻り値をラップできる。
 */
export const useAuth = () => {
  const auth = useOidcAuth();

  return {
    ...auth,
    isLoggedIn: auth.isAuthenticated,
    userName: auth.user?.profile?.name ?? '',
    email: auth.user?.profile?.email ?? '',
    accessToken: auth.user?.access_token ?? '',
    idToken: auth.user?.id_token ?? '',
  };
};
