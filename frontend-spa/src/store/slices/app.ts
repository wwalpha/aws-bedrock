import type { AppSlice, LoginResponse } from 'typings';
import type { SliceSet } from 'typings/slice';
import { apply, type SetStateAction } from '../utils';
import type { StateCreator } from 'zustand';
import { apiClient } from '@/lib/api/client';

// 認証 / アプリ共通状態用 Slice
// - トークンの保持と更新
// - ログイン / ログアウト API 呼び出し
// - 既存トークンでの状態再構築
export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set: SliceSet<AppSlice>) => ({
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
    const result = await apiClient.login({ username: email, password });

    if ('error' in result) {
      return { ok: false as const, error: result.error || 'Login failed' };
    }

    const data = result.data as LoginResponse;

    set((s) => ({
      idToken: data.idToken ?? s.idToken,
      accessToken: data.accessToken ?? s.accessToken,
    }));

    return { ok: true as const, data };
  },

  // ローカル状態だけをクリア（サーバー側セッションは触らない）
  logout: () => set(() => ({ idToken: null, accessToken: null })),

  // サーバーも含めログアウト（失敗してもローカルはクリア）
  async logoutApi() {
    await apiClient.logout();
    set(() => ({ idToken: null, accessToken: null }));
  },
});
