import type { ProfileSlice, Profile } from 'typings';
import type { SliceSet } from 'typings/slice';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// ログインユーザーの基本プロフィール情報
export const createProfileSlice: StateCreator<ProfileSlice, [], [], ProfileSlice> = (set: SliceSet<ProfileSlice>) => ({
  profile: null as Profile | null,
  setProfile: (value: SetStateAction<Profile | null>) => set((state) => ({ profile: apply(state.profile, value) })),
});
