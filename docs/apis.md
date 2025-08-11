# Backend API 一覧

## Chats

| メソッド | エンドポイント              | 説明                           |
| -------- | --------------------------- | ------------------------------ |
| POST     | `/chats`                    | 新しいチャットを作成する       |
| GET      | `/chats`                    | チャット一覧を取得する         |
| GET      | `/chats/{chatId}`           | 特定のチャットを取得する       |
| DELETE   | `/chats/{chatId}`           | 特定のチャットを削除する       |
| PUT      | `/chats/{chatId}/title`     | チャットのタイトルを更新       |
| GET      | `/chats/{chatId}/messages`  | チャットのメッセージ一覧を取得 |
| POST     | `/chats/{chatId}/messages`  | チャットにメッセージを追加     |
| POST     | `/chats/{chatId}/feedbacks` | チャットのフィードバックを更新 |

## ユーザー認証

| メソッド | エンドポイント  | 説明               |
| -------- | --------------- | ------------------ |
| POST     | `/auth/login`   | ログイン           |
| POST     | `/auth/logout`  | ログアウト         |
| POST     | `/auth/signup`  | ユーザー登録       |
| GET      | `/auth/session` | ログイン状態の確認 |
| GET      | `/user/profile` | プロフィールの取得 |
| POST     | `/user/profile` | プロフィールの更新 |

## システム設定

| メソッド | エンドポイント  | 説明                         |
| -------- | --------------- | ---------------------------- |
| GET      | `/api/settings` | システム／ユーザー設定の取得 |
| POST     | `/api/settings` | システム／ユーザー設定の更新 |

---

## モデル選択

| メソッド | エンドポイント | 説明                            |
| -------- | -------------- | ------------------------------- |
| GET      | `/api/models`  | 利用可能なLLMモデルの一覧を取得 |

---

## ファイルアップロード

| メソッド | エンドポイント   | 説明                         |
| -------- | ---------------- | ---------------------------- |
| POST     | `/api/upload`    | ファイルや画像をアップロード |
| GET      | `/api/files/:id` | アップロード                 |

---

## Predict

| メソッド | エンドポイント   | 説明                     |
| -------- | ---------------- | ------------------------ |
| POST     | `/predict`       | モデルを使用して予測する |
| POST     | `/predict/title` | タイトルを予測する       |

---

## System Contexts

| メソッド | エンドポイント                            | 説明                                 |
| -------- | ----------------------------------------- | ------------------------------------ |
| POST     | `/systemcontexts`                         | システムコンテキストを作成           |
| GET      | `/systemcontexts`                         | システムコンテキスト一覧を取得       |
| DELETE   | `/systemcontexts/{systemContextId}`       | 特定のシステムコンテキストを削除     |
| PUT      | `/systemcontexts/{systemContextId}/title` | システムコンテキストのタイトルを更新 |

---

## Image

| メソッド | エンドポイント    | 説明           |
| -------- | ----------------- | -------------- |
| POST     | `/image/generate` | 画像を生成する |

---

## Video

| メソッド | エンドポイント                  | 説明                     |
| -------- | ------------------------------- | ------------------------ |
| POST     | `/video/generate`               | 動画を生成する           |
| GET      | `/video/generate`               | 動画生成ジョブ一覧を取得 |
| DELETE   | `/video/generate/{createdDate}` | 動画生成ジョブを削除する |

---

## Web Text

| メソッド | エンドポイント | 説明                     |
| -------- | -------------- | ------------------------ |
| GET      | `/web-text`    | ウェブテキストを取得する |

---

## Shares

| メソッド | エンドポイント            | 説明                     |
| -------- | ------------------------- | ------------------------ |
| GET      | `/shares/chat/{chatId}`   | チャットの共有IDを取得   |
| POST     | `/shares/chat/{chatId}`   | チャットの共有IDを作成   |
| GET      | `/shares/share/{shareId}` | 共有されたチャットを取得 |
| DELETE   | `/shares/share/{shareId}` | 共有IDを削除する         |

---

## File

| メソッド | エンドポイント     | 説明                                      |
| -------- | ------------------ | ----------------------------------------- |
| POST     | `/file/url`        | ファイルアップロード用の署名付きURLを取得 |
| GET      | `/file/url`        | ファイルダウンロード用の署名付きURLを取得 |
| DELETE   | `/file/{fileName}` | ファイルを削除する                        |

## DXC Chat Web API (ASP.NET) 一覧

以下は `dxc-chat-main/webapi` 配下（ASP.NET Web API）のエンドポイント一覧です。カッコ内に認可要件を明記しています。

- [JWT] = JWT 認証必須（[Authorize]）
- [API Key] = `x-dxcchat-api-key` ヘッダー、または `Authorization: Bearer <apiKey>` を要求
- [Public] = 認証不要（[AllowAnonymous]）

### Service Info / Health

- GET `/info` [Public] サービス情報（利用可能なLLM/MCPなど）
- GET `/healthz` [Public] ヘルスチェック
- GET `/speechToken` [JWT] Azure Speech 用トークン取得

### 認証

- POST `/auth/login` [Public] ログイン（レスポンス: token, userId, username, name, groups）
- GET `/auth/validate` [JWT] トークン検証
- GET `/auth/userinfo` [JWT] ログインユーザー情報取得

### チャット（履歴/セッション） ChatHistoryController

- POST `/chats` [JWT] チャット作成（初期Botメッセージ付与）
- GET `/chats` [JWT] 自分のチャット一覧取得（チャットルーム含む）
- GET `/chats/{chatId}` [JWT] チャット詳細取得
- DELETE `/chats/{chatId}` [JWT] チャット削除（添付/メモリ/ファイルも削除）
- PATCH `/chats/{chatId}` [JWT] チャット編集（タイトル/Preferences/ピン留め 等）
- GET `/chats/chatgroups` [JWT] 追加作成可能なチャットグループ一覧（Virtual Expert 連携）
- GET `/chats/{chatId}/messages` [JWT] メッセージ一覧取得（翻訳結果含む可能性）
- DELETE `/chats/{chatId}/messages?startIndex={n}&initialChat={bool}` [JWT] 指定開始位置以降のメッセージ削除（初期化時は関連リソースも削除）

### チャット（送信/タイトル生成） ChatV2Controller

- POST `/chats/{chatId}/messages` [JWT] メッセージ送信（サーバ側で非同期ストリーミング更新）
- POST `/chats/{chatId}/title` [JWT] チャットタイトル生成

### チャット（旧API） ChatController

- POST `/chat` [JWT] 汎用チャット実行（Ask 形式）

### チャットルーム ChatRoomController / ChatRoomChatController

- POST `/chatrooms` [JWT] チャットルーム作成（招待キー発行）
- DELETE `/chatrooms/{chatId}` [JWT] チャットルーム削除（参加者/メッセージ/ドキュメントもクリーン）
- GET `/chatrooms/{chatId}/invitation_key` [JWT] 招待キー取得（オーナーのみ）
- POST `/chatrooms/{chatId}/join` [JWT] 参加（招待キー検証、言語設定）
- GET `/chatrooms/{chatId}/leave` [JWT] 退室
- POST `/chatrooms/{chatId}/remove` [JWT] 参加者の強制退出（オーナーのみ）
- GET `/chatrooms/{chatId}/participants` [JWT] 参加者一覧取得（参加者のみ閲覧可）
- PATCH `/chatrooms/{chatId}/Participant` [JWT] 参加者のタイムスタンプ更新（自分）
- POST `/chatrooms/{roomId}/chat` [JWT] ルーム内にメッセージ送信（各参加者の言語に翻訳・配信）

### ドキュメント DocumentController

- GET `/user/documents` [JWT] ユーザー領域のドキュメント一覧
- POST `/user/documents` [JWT] ユーザー領域へファイルアップロード（multipart/form-data）
- POST `/user/sharepoint` [JWT] ユーザー領域へ SharePoint から取り込み
- GET `/user/documents/{documentId}` [JWT] ユーザー領域のドキュメントダウンロード
- DELETE `/user/documents/{documentId}` [JWT] ユーザー領域のドキュメント削除
- POST `/chats/{chatId}/documents` [JWT] チャットにファイルをアップロード（multipart/form-data, 文字コード変換対応）
- POST `/chats/{chatId}/sharepoint` [JWT] チャットに SharePoint から取り込み（大容量も対応）
- GET `/chats/{chatId}/documents/{documentId}/{fileName}` [JWT] チャットのドキュメントダウンロード

### ストレージ StorageController

- POST `/storage/files/{filePath}` [JWT] バイト列を保存
- POST `/storage/files/` [JWT] Base64 文字列で複数ファイル保存（AttachmentFile[]）
- GET `/storage/files/{chatId}/{documentId}/{fileName}` [JWT] 保存ファイル取得
- GET `/storage/output/{chatId}/{documentId}/{fileName}` [JWT] 出力ファイル取得（コード実行/文字起こし等）
- GET `/storage/files/content/{filePath}` [JWT] 任意パスのファイル取得
- DELETE `/storage/files/{filePath}` [JWT] ファイル削除
- GET `/storage/files/search?chatId={id}&filename={name}` [JWT] ファイル検索

### ユーザー設定 UserSettingController

- POST `/usersettings` [JWT] ユーザー設定作成（重複時は既存返却）
- PATCH `/usersettings` [JWT] ユーザー設定更新

### Bot エクスポート/インポート BotController

- POST `/bot/upload` [JWT] Bot 定義（履歴/設定）をアップロードしてチャット複製
- GET `/bot/download/{chatId}` [JWT] 指定チャットを Bot 定義としてダウンロード

### 外部API v1（プラグイン直呼出し） ChatExternalApiController

Base: `/ext_api/v1` [API Key]

- POST `/ext_api/v1/new_chat` チャット新規作成（chatId 返却）
- POST `/ext_api/v1/clear_chat?chat_id={chatId}` チャットクリア
- POST `/ext_api/v1/upload_documents?chat_id={chatId}` ドキュメント取り込み（multipart/form-data）
- POST `/ext_api/v1/completion` 非ストリーミングの補完実行（Ask）
- POST `/ext_api/v1/completion/streaming` ストリーミング補完（SSE, data: チャンク）

### 外部API v2（エージェント経由） ChatExternalApiV2Controller

Base: `/ext_api` [API Key]

- POST `/ext_api/new_chat` チャット新規作成
- POST `/ext_api/clear_chat?chat_id={chatId}` チャットクリア
- POST `/ext_api/upload_documents?chat_id={chatId}` ドキュメント取り込み（multipart/form-data）
- POST `/ext_api/completion` 非ストリーミング補完（Ask, chatId 任意/要検証）
- POST `/ext_api/completion/streaming` ストリーミング補完（SSE）
- POST `/ext_api/chat` 非ストリーミングチャット（Ask + chatId 必須）
- POST `/ext_api/chat/streaming` ストリーミングチャット（SSE）

### 管理 API AdminController

Base: `/admin_api` [API Key]

- POST `/admin_api/clear_chat?chat_id={chatId}` チャット全削除（ファイル/メモリ含む）

注記:

- [JWT] は AuthController の `/auth/login` で取得した `token` を `Authorization: Bearer <token>` で送信。
- [API Key] はヘッダー `x-dxcchat-api-key: <key>` または `Authorization: Bearer <key>` のいずれか。
