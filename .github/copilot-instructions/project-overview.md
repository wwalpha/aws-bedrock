# Copilot 実装ガイド (Implementation Instructions)

このドキュメントは frontend-spa への移行と今後の機能開発で合意したコーディング規約・設計方針をまとめたものです。新規実装・リファクタ時の判断基準として参照してください。

## 1. 状態管理 (Zustand)

- `store/index.ts` での結合順序自体に意味はないが、概ねアルファベット順で可読性を維持。
- 汎用 `apply` ヘルパは使わない（DevTools での追跡性を優先）。
- 永続化は最低限の UX / ナビゲーション文脈のみ (`partialize` を参照)。

## 2. API クライアント層 (API Client Layer)

- `ApiClient` は低レベル HTTP ラッパ (汎用メソッド or リソース単位の最小 helper) のみに留める。
- 文字列パスはハードコード禁止。`API_ENDPOINTS` 定数を必ず使用。
- client 内で store を直接 import しない。循環参照回避のため `attachStoreAccessor` で遅延参照。

## 3. Chat Slice (`chat.ts`)

- 責務: チャットグループ CRUD とローディング/エラーフラグ (`chatsLoading`, `chatsError`)。
- メソッド: `fetchChats`, `createChat`, `updateChat`, `deleteChat`。

## 4. Auth Slice (`app.ts`)

- 保持するもの: `idToken`, `accessToken`, `refreshToken`, `isLoggined`。
- アクション: `login`, `signup`, `confirmSignup`, `logout`, `logoutApi`。
- `login` は Axios が非 2xx で throw する前提で成功時のみ state 書き換え。
- `logoutApi` は成功/失敗に関わらず finally でトークンをクリア。

## 5. コードスタイル & フォーマット

- コードの可読性の優先度は高い。必要に応じてコメント、空白行を追加。
- 複雑なロジックには関数を分割して可読性を向上させる。
- 論理的 import グループの間に空行。ただし同一モジュール群での type-only import と実体 import の間には入れない。
- セクション区切りコメント (例: `// --- Auth Status ---`) を目的が明確な場合に付与。
- 過度な抽象化は避け、明確な重複削減に限る。
- 早期 return を優先し、ネストした if ツリーを避ける。

## 6. 永続化戦略 (Persistence Strategy)

- 永続化対象: `chats`, `selectedChat`, `presets`, `selectedPreset`, `profile`, `workspaces`, `selectedWorkspace`。
- トークンはセキュリティ観点でメモリのみ検討を継続。
- 一時的な loading / error フラグは永続化しない。

## 7. 今後の課題 / TODOs (Future Work)

- [ ] 全 Slice への DevTools action ラベル導入。
- [ ] メッセージ専用 slice (`chatMessagesSlice`) とページング/ストリーミング対応。
- [ ] Chat 系 \*Response 型の実 API への接続 (envelope 対応)。
- [ ] create/update/delete の楽観的更新 + rollback 実装。
- [ ] HTTP ステータス → ユーザ向けメッセージ変換の集中エラー正規化ユーティリティ。
- [ ] Chat slice の reducer / async フローの単体テスト (vitest)。

## 8. 避けるべきパターン (Patterns to Avoid)

- 循環 import (ApiClient 内は accessor 経由)。
- 意図を伴わない握りつぶし catch（logout の best-effort など例外的ケースを除く）。
- 大きな state オブジェクトの安易なスプレッド再構築 (`set({ ...state, ... })`)。部分更新関数を使用。

## 9. マージ前レビュー チェックリスト (Review Checklist Before Merging)

- 文字列パスは `API_ENDPOINTS` 定数を使用 (直書きなし)。
- 新規リクエスト/レスポンス型は `typings/api-client.d.ts` に追加。
- 新しい Slice セクションには目的が分かるコメントを付与。
- ユーティリティからの直接 `store` import なし (accessor 例外)。
- DevTools 上で意味のあるキー/アクションとして表示される。

---

内容が古くなった場合は、該当コード変更と同じ PR でこのファイルも更新してください。
