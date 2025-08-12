import type { AppSlice } from 'typings';
import type { LoginResponse } from 'typings/auth';
import type { LoginRequest } from 'typings/auth';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// 認証 / アプリ共通状態用 Slice
// - トークンの保持と更新
// - ログイン / ログアウト API 呼び出し
// - 既存トークンでの状態再構築
export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set: SliceSet<AppSlice>) => ({
  // Cognito など Id トークン (ユーザー属性検証用)
  idToken: null,

  // アプリ / API 呼び出し向けアクセストークン
  accessToken: null,

  refreshToken: null,

  // ログイン処理
  // 成功: { ok: true, data } / 失敗: { ok: false, error }
  async login(email: string, password: string) {
    const res = await apiClient.post<LoginResponse, LoginRequest>(API_ENDPOINTS.AUTH_LOGIN, {
      username: email,
      password,
    });

    if (res.status !== 200) {
      return;
    }

    set(() => ({
      idToken: res.data.idToken || null,
      accessToken: res.data.accessToken || null,
      refreshToken: res.data.refreshToken || null,
    }));
  },

  // ローカル状態だけをクリア（サーバー側セッションは触らない）
  logout: () => set(() => ({ idToken: null, accessToken: null, refreshToken: null })),

  // サーバーも含めログアウト（失敗してもローカルはクリア）
  async logoutApi() {
    try {
      await apiClient.post<{ success?: boolean }, Record<string, never>>(API_ENDPOINTS.AUTH_LOGOUT, {} as any);
    } catch {
      // ignore
    } finally {
      set(() => ({ idToken: null, accessToken: null, refreshToken: null }));
    }
  },
});
