import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { cognitoAuthConfig } from './oidcConfig';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <OidcAuthProvider {...cognitoAuthConfig}>{children}</OidcAuthProvider>
);
