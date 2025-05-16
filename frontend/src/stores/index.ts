import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { StoreState } from 'typings';

// ストアの作成
const useStore = create<StoreState>()(devtools((...args) => ({})));

export default useStore;
