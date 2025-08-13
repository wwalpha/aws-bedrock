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

## 共通ルール（全Slice共通）

- 各Sliceのメソッドは「stateのみを更新し、return値は返さない」。
- API response型に属性が定義されていない場合（空object等）、`const res = ...` のような変数定義は不要 (副作用のみ実行)。
- xxxMessage 系フィールドは slice 内部の async メソッド内でのみ更新し、UI から setter を公開しない (UI は参照のみ)。
- 成否判定ロジック（HTTP 成功/失敗に基づく分岐）は極力 slice 内に寄せ、UI は loading / message / state を監視するだけに留める。
- すべての非同期アクションは `withLoadingErrorCurried(set, '<loadingKey>', '<messageKey>')` を利用し、loading と message の責務を統一する。

## 3. Chat Slice (`chat.ts`)

- 責務: チャットグループ CRUD 管理とローディング/エラーフラグ (`chatsLoading`, `chatsError`).
- メソッド: `fetchChats`, `createChat`, `updateChat`, `deleteChat`。
- UI への結果伝達は戻り値ではなく state (chats / chatsLoading / chatsError) を監視して行う。
- API レスポンスは envelope 形式 `{ items: Chat[] }` (固定) を前提 (`ChatListResponse`).
- リクエスト/レスポンス型命名: `CreateChatRequest`, `UpdateChatRequest`, `ChatListResponse`, `ChatCreateResponse`, `ChatUpdateResponse`, `ChatDeleteResponse`。
- エラー処理: ApiClient の `get/post/put/delete` の `onError` callback を利用し slice 内でフラグ更新。Slice 側で追加の catch は基本不要。

## 4. Auth Slice (`app.ts`)

- 保持するもの: `idToken`, `accessToken`, `refreshToken`, `isLoggined`, `authLoading`, `authMessage`。
- アクション: `login`, `signup`, `confirmSignup`, `logout`, `logoutApi`。
- すべての認証系 async メソッドは `withLoadingErrorCurried(set, 'authLoading', 'authMessage')` 経由。成功/失敗に伴うメッセージも slice 内で設定し、UI は `authLoading` / `authMessage` を参照するのみ。
- `login` は Axios が非 2xx で throw する前提で成功時のみ state 書き換え。
- `logoutApi` は成功/失敗に関わらず finally でトークンをクリア。

## 5. コードスタイル & フォーマット

- コードの可読性を最優先する。論理ブロックや処理のまとまりごとに空白行を入れる。
- 1行コメントは「なぜ」「何を」明確に記述し、関数・クラス・大きな処理単位の直上に付与する。
- セクション区切りやsliceの責務など、目的が明確な場合はブロックコメント（`// --- Section ---`）を使う。
- 変数宣言・import・関数定義・処理ブロックの間には、必要に応じて空白行を入れ、詰め込みすぎない。
- ただし、同一モジュール群での type-only import と実体 import の間には空白行を入れない。
- 複雑なロジックには関数を分割して可読性を向上させる。
- 過度な抽象化は避け、明確な重複削減に限る。
- 早期 return を優先し、ネストした if ツリーを避ける。

### UI コンポーネント内コメント方針 (New)

- UI (React コンポーネント) では詳細な逐次コメントを避け、セクション境界や意図説明が必要な最小限のブロックコメントのみ許可。
- ビジネスロジック/成否分岐説明は slice 側に集約し、UI 側でのコメント増殖を防ぐ。
- 既存の過剰な行コメントは段階的に削除・縮約し、`// --- Section ---` 形式に統一。

// コメント・空白行の具体例
//
// import ...
//
// // --- Chat Slice: チャット一覧・作成・更新・削除 ---
//
// export const createChatSlice = ...
//
// // 一覧取得
// fetchChats: ...
//
// // 作成
// createChat: ...
//
// // 更新
// updateChat: ...
//
// // 削除
// deleteChat: ...
//
// ...

- 複雑なロジックには関数を分割して可読性を向上させる。
- 論理的 import グループの間に空行。ただし同一モジュール群での type-only import と実体 import の間には入れない。
- セクション区切りコメント (例: `// --- Auth Status ---`) を目的が明確な場合に付与。
- 過度な抽象化は避け、明確な重複削減に限る。
- 早期 return を優先し、ネストした if ツリーを避ける。

### async/await の徹底

- Promise クラスの new Promise/Promise.resolve/Promise.reject など直接利用は禁止。
- 非同期処理は必ず async/await 構文で記述する。
- 例外処理は try/catch で行い、catch 節の型は unknown で受ける。

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
