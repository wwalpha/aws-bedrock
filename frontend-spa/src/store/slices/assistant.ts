import type { AssistantSlice, Assistant } from 'typings';
import { apply } from '../utils';

// アシスタント (キャラクター / プロファイル) 関連の選択・一覧状態を保持
export const createAssistantSlice = (set: any) =>
  ({
    // 現在選択中のアシスタント
    selectedAssistant: null as Assistant | null,
    setSelectedAssistant: (v: any) =>
      set((s: AssistantSlice) => ({ selectedAssistant: apply(s.selectedAssistant, v) })),

    // アシスタントの画像（アバター等）のパス / URL 配列
    assistantImages: [] as string[],
    setAssistantImages: (v: any) => set((s: AssistantSlice) => ({ assistantImages: apply(s.assistantImages, v) })),

    // OpenAI Assistants API など外部由来のアシスタント一覧
    openaiAssistants: [] as Assistant[],
    setOpenaiAssistants: (v: any) => set((s: AssistantSlice) => ({ openaiAssistants: apply(s.openaiAssistants, v) })),
  }) as AssistantSlice;
