import type { AssistantSlice } from 'typings';
import { apply } from '../utils';

export const createAssistantSlice = (set: any) =>
  ({
    selectedAssistant: null,
    setSelectedAssistant: (v: any) =>
      set((s: AssistantSlice) => ({ selectedAssistant: apply(s.selectedAssistant, v) })),
    assistantImages: [],
    setAssistantImages: (v: any) => set((s: AssistantSlice) => ({ assistantImages: apply(s.assistantImages, v) })),
    openaiAssistants: [],
    setOpenaiAssistants: (v: any) => set((s: AssistantSlice) => ({ openaiAssistants: apply(s.openaiAssistants, v) })),
  }) as AssistantSlice;
