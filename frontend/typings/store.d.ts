export type StoreState = AuthSlice;

export interface AuthSlice {
  user: any | null;
  accessToken: string | null;
  idToken: string | null;
  setAuthInfo: (user: any, accessToken: string, idToken: string) => void;
  clearAuthInfo: () => void;
}
