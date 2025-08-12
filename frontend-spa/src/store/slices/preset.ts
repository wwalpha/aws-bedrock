import type { PresetSlice, Preset } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// プロンプト / 設定 プリセットの選択状態のみ保持する軽量 Slice
type SliceSet = (fn: (state: PresetSlice) => Partial<PresetSlice>) => void;

export const createPresetSlice: StateCreator<PresetSlice, [], [], PresetSlice> = (set: SliceSet) => ({
  selectedPreset: null as Preset | null,
  setSelectedPreset: (v: SetStateAction<Preset | null>) => set((s) => ({ selectedPreset: apply(s.selectedPreset, v) })),
});
