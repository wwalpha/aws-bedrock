import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import { StoreState } from 'typings';

export const useStore = create<StoreState>()(
  devtools((...args) => ({
    ...createAuthSlice(...args),
  }))
);

export default useStore;
