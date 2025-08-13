// Minimal type definitions copied for SPA use (no cross-project refs)

// Duplicate simplified AppSlice kept for SPA tooling; ensure it mirrors index.d.ts
export interface AppSlice {
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggined: boolean;
  authLoading: boolean;
  authMessage: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  logout: () => void;
  logoutApi: () => Promise<void>;
}

// Note: The SPA now exposes a single Zustand store at `src/store/index.ts` (useChatStore)
// which includes this AppSlice. Prefer importing from '@/store'.
