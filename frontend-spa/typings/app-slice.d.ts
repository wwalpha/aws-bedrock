// Minimal type definitions copied for SPA use (no cross-project refs)

export interface AppSlice {
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  logoutApi: () => Promise<void>;
}

// Note: The SPA now exposes a single Zustand store at `src/store/index.ts` (useChatStore)
// which includes this AppSlice. Prefer importing from '@/store'.
