import type { PresetSlice, Preset } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// プロンプト / 設定 プリセットの選択状態のみ保持する軽量 Slice
export const createPresetSlice: StateCreator<PresetSlice, [], [], PresetSlice> = (set: SliceSet<PresetSlice>) => ({
  selectedPreset: null as Preset | null,
  setSelectedPreset: (v: Preset | null | ((prev: Preset | null) => Preset | null)) =>
    set((s) => ({ selectedPreset: typeof v === 'function' ? (v as any)(s.selectedPreset) : v })),
});
