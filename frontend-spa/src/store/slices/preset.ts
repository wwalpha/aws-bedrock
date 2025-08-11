import type { PresetSlice } from 'typings';
import { apply } from '../utils';

export const createPresetSlice = (set: any) =>
  ({
    selectedPreset: null,
    setSelectedPreset: (v: any) => set((s: PresetSlice) => ({ selectedPreset: apply(s.selectedPreset, v) })),
  }) as PresetSlice;
