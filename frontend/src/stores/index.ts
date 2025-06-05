import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import { createSidebarSlice } from './slices/sidebarSlice';
import { createUIContextSlice } from './slices/uiContextSlice';

import { StoreState } from 'typings';

export const useStore = create<StoreState>()(
  devtools((...args) => ({
    ...createAuthSlice(...args),
    ...createSidebarSlice(...args),
    ...createUIContextSlice(...args)
  }))
);

export default useStore;
