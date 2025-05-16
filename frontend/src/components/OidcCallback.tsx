import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOidc } from 'react-oidc-context';

export default function OidcCallback() {
  const oidc = useOidc();
  const navigate = useNavigate();

  useEffect(() => {
    if (oidc.activeNavigator === 'signinRedirect') {
      oidc.signinRedirectCallback().then(() => {
        navigate('/');
      });
    }
  }, [oidc, navigate]);

  return <p>Signing in...</p>;
}
