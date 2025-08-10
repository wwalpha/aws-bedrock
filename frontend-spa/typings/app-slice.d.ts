// Minimal type definitions copied for SPA use (no cross-project refs)

export interface LoginResponse {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any;
}

export interface AppSlice {
  idToken: string | null;
  accessToken: string | null;
  setIdToken: (v: string | null | ((prev: string | null) => string | null)) => void;
  setAccessToken: (v: string | null | ((prev: string | null) => string | null)) => void;
  loginWithTokens: (params: { idToken?: string; accessToken?: string }) => void;
  login: (email: string, password: string) => Promise<{ ok: true; data: LoginResponse } | { ok: false; error: string }>;
  logout: () => void;
  logoutApi: () => Promise<void>;
}
