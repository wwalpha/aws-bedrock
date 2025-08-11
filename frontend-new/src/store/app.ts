import { create } from 'zustand';
import type { AppSlice } from 'typings/app-slice';

export const useAppStore = create<AppSlice>()((set, get) => ({
  idToken: null,
  accessToken: null,
  setIdToken: (v) => set({ idToken: typeof v === 'function' ? (v as any)(get().idToken) : v }),
  setAccessToken: (v) => set({ accessToken: typeof v === 'function' ? (v as any)(get().accessToken) : v }),
  loginWithTokens: ({ idToken, accessToken }) =>
    set((s) => ({ idToken: idToken ?? s.idToken, accessToken: accessToken ?? s.accessToken })),
  login: async (email: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => 'Login failed');
        return { ok: false as const, error: text || 'Login failed' };
      }
      const data = await res.json();
      // Expecting shape compatible with LoginResponse: { idToken, accessToken, ... }
      const { idToken, accessToken } = data || {};
      if (idToken || accessToken) {
        set({ idToken: idToken ?? null, accessToken: accessToken ?? null });
      }
      return { ok: true as const, data };
    } catch (e: any) {
      return { ok: false as const, error: e?.message || 'Network error' };
    }
  },
  logout: () => set({ idToken: null, accessToken: null }),
  logoutApi: async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/auth/logout`, {
        method: 'POST',
      });
    } catch {
      // ignore network errors on logout
    } finally {
      set({ idToken: null, accessToken: null });
    }
  },
}));
