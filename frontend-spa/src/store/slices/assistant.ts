import type { AssistantSlice, Assistant } from 'typings';
import type { SliceSet } from 'typings/slice';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// アシスタント (キャラクター / プロファイル) 関連の選択・一覧状態を保持
export const createAssistantSlice: StateCreator<AssistantSlice, [], [], AssistantSlice> = (set: SliceSet<AssistantSlice>) => ({
  // 現在選択中のアシスタント
  selectedAssistant: null as Assistant | null,
  setSelectedAssistant: (v: SetStateAction<Assistant | null>) =>
    set((s) => ({ selectedAssistant: apply(s.selectedAssistant, v) })),

  // アシスタントの画像（アバター等）のパス / URL 配列
  assistantImages: [] as string[],
  setAssistantImages: (v: SetStateAction<string[]>) => set((s) => ({ assistantImages: apply(s.assistantImages, v) })),

  // OpenAI Assistants API など外部由来のアシスタント一覧
  openaiAssistants: [] as Assistant[],
  setOpenaiAssistants: (v: SetStateAction<Assistant[]>) =>
    set((s) => ({ openaiAssistants: apply(s.openaiAssistants, v) })),
});
