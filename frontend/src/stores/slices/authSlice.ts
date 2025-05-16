import { AuthSlice } from 'typings/store';
import { StateCreator } from 'zustand';

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  user: null,
  accessToken: null,
  idToken: null,

  // Set the authentication information
  setAuthInfo: (user, accessToken, idToken) => set({ user, accessToken, idToken }),

  // Clear the authentication information
  clearAuthInfo: () => set({ user: null, accessToken: null, idToken: null }),
});
