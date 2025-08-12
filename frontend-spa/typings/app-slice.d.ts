// Minimal type definitions copied for SPA use (no cross-project refs)

// Duplicate simplified AppSlice kept for SPA tooling; ensure it mirrors index.d.ts
export interface AppSlice {
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggined: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<boolean>;
  confirmSignup: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  logoutApi: () => Promise<void>;
}

// Note: The SPA now exposes a single Zustand store at `src/store/index.ts` (useChatStore)
// which includes this AppSlice. Prefer importing from '@/store'.
