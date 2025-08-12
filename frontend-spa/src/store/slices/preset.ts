import type { PresetSlice, Preset } from 'typings';
import { apply } from '../utils';

// プロンプト / 設定 プリセットの選択状態のみ保持する軽量 Slice
export const createPresetSlice = (set: any) =>
  ({
    selectedPreset: null as Preset | null,
    setSelectedPreset: (v: any) => set((s: PresetSlice) => ({ selectedPreset: apply(s.selectedPreset, v) })),
  }) as PresetSlice;
