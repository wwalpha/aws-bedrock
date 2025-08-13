import type { AssistantSlice, Assistant } from 'typings';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';

// アシスタント (キャラクター / プロファイル) 関連の選択・一覧状態を保持
export const createAssistantSlice: StateCreator<AssistantSlice, [], [], AssistantSlice> = (
  set: SliceSet<AssistantSlice>
) => ({
  // 現在選択中のアシスタント
  selectedAssistant: null as Assistant | null,
  setSelectedAssistant: (v: Assistant | null | ((prev: Assistant | null) => Assistant | null)) =>
    set((s) => ({ selectedAssistant: typeof v === 'function' ? (v as any)(s.selectedAssistant) : v })),

  // アシスタントの画像（アバター等）のパス / URL 配列
  assistantImages: [] as string[],
  setAssistantImages: (v: string[] | ((prev: string[]) => string[])) =>
    set((s) => ({ assistantImages: typeof v === 'function' ? (v as any)(s.assistantImages) : v })),

  // OpenAI Assistants API など外部由来のアシスタント一覧
  openaiAssistants: [] as Assistant[],
  setOpenaiAssistants: (v: Assistant[] | ((prev: Assistant[]) => Assistant[])) =>
    set((s) => ({ openaiAssistants: typeof v === 'function' ? (v as any)(s.openaiAssistants) : v })),
});
