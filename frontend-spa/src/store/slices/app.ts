import type { AppSlice, LoginResponse } from 'typings';
import { apply } from '../utils';

// 認証 / アプリ共通状態用 Slice
// - トークンの保持と更新
// - ログイン / ログアウト API 呼び出し
// - 既存トークンでの状態再構築
export const createAppSlice = (set: any) =>
  ({
    // Cognito など Id トークン (ユーザー属性検証用)
    idToken: null,

    // アプリ / API 呼び出し向けアクセストークン
    accessToken: null,

    // idToken を更新（apply: 値がオブジェクトならマージ／プリミティブなら置換）
    setIdToken: (value: any) => set((s: AppSlice) => ({ idToken: apply(s.idToken, value) })),

    // accessToken を更新
    setAccessToken: (value: any) => set((s: AppSlice) => ({ accessToken: apply(s.accessToken, value) })),

    // 既に持っている外部ソース（SSO リダイレクト後など）からのトークンをまとめて適用
    loginWithTokens: ({ idToken, accessToken }: { idToken?: string; accessToken?: string }) =>
      set((s: AppSlice) => ({ idToken: idToken ?? s.idToken, accessToken: accessToken ?? s.accessToken })),

    // ログイン処理
    // 成功: { ok: true, data } / 失敗: { ok: false, error }
    async login(email: string, password: string) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/auth/login`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ username: email, password }),
        });

        if (!res.ok) {
          // サーバー側がメッセージを返さない場合は汎用メッセージ
          const msg = (await res.text()) || 'Login failed';
          return { ok: false as const, error: msg };
        }

        // サーバー期待レスポンス: { idToken?: string; accessToken?: string; ... }
        const data = (await res.json()) as LoginResponse;

        // 既存値を保持しつつ新規取得分だけ上書き
        set((s: AppSlice) => ({
          idToken: data.idToken ?? s.idToken,
          accessToken: data.accessToken ?? s.accessToken,
        }));

        return { ok: true as const, data };
      } catch (e: any) {
        // ネットワーク / 予期せぬ例外
        return { ok: false as const, error: e?.message || 'Login failed' };
      }
    },

    // ローカル状態だけをクリア（サーバー側セッションは触らない）
    logout: () => set(() => ({ idToken: null, accessToken: null })),

    // サーバーも含めログアウト（失敗してもローカルはクリア）
    async logoutApi() {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/auth/logout`, { method: 'POST' });
      } catch {
        // ネットワークエラー等は握りつぶし（ユーザー操作は完了させる）
      }
      set(() => ({ idToken: null, accessToken: null }));
    },
  }) as AppSlice;

// 型補完用エクスポート（実体は createAppSlice で生成）
export default undefined as unknown as AppSlice;
