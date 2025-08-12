import type { AssistantSlice, Assistant } from 'typings';
import { apply } from '../utils';

export const createAssistantSlice = (set: any) =>
  ({
    selectedAssistant: null as Assistant | null,
    setSelectedAssistant: (v: any) =>
      set((s: AssistantSlice) => ({ selectedAssistant: apply(s.selectedAssistant, v) })),
    assistantImages: [] as string[],
    setAssistantImages: (v: any) => set((s: AssistantSlice) => ({ assistantImages: apply(s.assistantImages, v) })),
    openaiAssistants: [] as Assistant[],
    setOpenaiAssistants: (v: any) => set((s: AssistantSlice) => ({ openaiAssistants: apply(s.openaiAssistants, v) })),
  }) as AssistantSlice;
