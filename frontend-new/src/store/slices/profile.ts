import type { ProfileSlice } from 'typings';
import { apply } from '../utils';

export const createProfileSlice = (set: any) =>
  ({
    profile: null,
    setProfile: (value: any) => set((state: ProfileSlice) => ({ profile: apply(state.profile, value) })),
  }) as ProfileSlice;
