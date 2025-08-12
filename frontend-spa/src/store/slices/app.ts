import type { AppSlice, LoginResponse } from 'typings';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';

// 認証 / アプリ共通状態用 Slice
// - トークンの保持と更新
// - ログイン / ログアウト API 呼び出し
// - 既存トークンでの状態再構築
/**
 * AppSlice 生成関数
 * Zustand の全体ステートにマージされる想定だが、ここでは AppSlice に必要なフィールドのみ型を意識。
 * any を排除し、引数 / 返り値を厳密化。
 */
type SliceSet = (fn: (state: AppSlice) => Partial<AppSlice>) => void;

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set: SliceSet) => ({
  // Cognito など Id トークン (ユーザー属性検証用)
  idToken: null,

  // アプリ / API 呼び出し向けアクセストークン
  accessToken: null,

  // idToken を更新（apply: 値がオブジェクトならマージ／プリミティブなら置換）
  setIdToken: (value: SetStateAction<string | null>) => set((s) => ({ idToken: apply(s.idToken, value) })),

  // accessToken を更新
  setAccessToken: (value: SetStateAction<string | null>) => set((s) => ({ accessToken: apply(s.accessToken, value) })),

  // 既に持っている外部ソース（SSO リダイレクト後など）からのトークンをまとめて適用
  loginWithTokens: ({ idToken, accessToken }: { idToken?: string; accessToken?: string }) =>
    set((s) => ({ idToken: idToken ?? s.idToken, accessToken: accessToken ?? s.accessToken })),

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
      set((s) => ({
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
});

// 型補完用エクスポート（実体は createAppSlice で生成）
// default export は互換保持のため残す（将来的に削除可）
export default undefined as unknown as AppSlice;
