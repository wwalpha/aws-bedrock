import type { ProfileSlice, Profile } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// ログインユーザーの基本プロフィール情報
export const createProfileSlice: StateCreator<ProfileSlice, [], [], ProfileSlice> = (set: SliceSet<ProfileSlice>) => ({
  profile: null as Profile | null,
  setProfile: (v: Profile | ((prev: Profile | null) => Profile | null) | null) =>
    set((s) => ({ profile: typeof v === 'function' ? (v as any)(s.profile) : v })),
});
