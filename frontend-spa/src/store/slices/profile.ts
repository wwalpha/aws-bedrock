import type { ProfileSlice, Profile } from 'typings';
import { apply } from '../utils';

// ログインユーザーの基本プロフィール情報
export const createProfileSlice = (set: any) =>
  ({
    profile: null as Profile | null,
    setProfile: (value: any) => set((state: ProfileSlice) => ({ profile: apply(state.profile, value) })),
  }) as ProfileSlice;
