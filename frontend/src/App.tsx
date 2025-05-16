import { useAuth } from 'react-oidc-context';

export const App = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return;
  }

  return (
    <div>
      <pre> Hello: {auth.user?.profile.email} </pre>
      <pre> ID Token: {auth.user?.id_token} </pre>
      <pre> Access Token: {auth.user?.access_token} </pre>
      <pre> Refresh Token: {auth.user?.refresh_token} </pre>

      <button onClick={() => auth.removeUser()}>Sign out</button>
    </div>
  );
};

export default App;
