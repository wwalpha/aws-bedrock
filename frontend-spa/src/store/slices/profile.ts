import type { ProfileSlice, Profile } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// ログインユーザーの基本プロフィール情報
type SliceSet = (fn: (state: ProfileSlice) => Partial<ProfileSlice>) => void;

export const createProfileSlice: StateCreator<ProfileSlice, [], [], ProfileSlice> = (set: SliceSet) => ({
  profile: null as Profile | null,
  setProfile: (value: SetStateAction<Profile | null>) => set((state) => ({ profile: apply(state.profile, value) })),
});
