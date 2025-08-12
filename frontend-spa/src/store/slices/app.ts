import type { AppSlice } from 'typings';
import type {
  LoginResponse,
  LoginRequest,
  SignupRequest,
  SignupResponse,
  ConfirmSignupRequest,
  ConfirmSignupResponse,
} from 'typings/auth';
import type { SliceSet } from 'typings/slice';
import type { StateCreator } from 'zustand';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// 認証 / アプリ共通状態用 Slice
// - トークンの保持と更新
// - ログイン / ログアウト API 呼び出し
// - 既存トークンでの状態再構築
export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set: SliceSet<AppSlice>) => ({
  // --- Token State ------------------------------------------------------
  // Cognito など Id トークン (ユーザー属性検証用)
  idToken: null,

  // アプリ / API 呼び出し向けアクセストークン
  accessToken: null,

  // リフレッシュトークン（未使用だが今後の自動更新で利用）
  refreshToken: null,

  // --- Auth Status ------------------------------------------------------
  // ログイン状態フラグ（API 成功で true / ログアウトで false）
  isLoggined: false,

  // --- Actions: Auth Flow -----------------------------------------------
  // ログイン処理 (成功時のみ state 更新。失敗時は axios が throw する想定)
  async login(email: string, password: string) {
    const res = await apiClient.post<LoginResponse, LoginRequest>(API_ENDPOINTS.AUTH_LOGIN, {
      username: email,
      password,
    });

    // 2xx 以外は axios が throw するのでここに来れば成功
    set(() => ({
      idToken: res.data.idToken || null,
      accessToken: res.data.accessToken || null,
      refreshToken: res.data.refreshToken || null,
      isLoggined: true,
    }));
  },

  // サインアップ (ユーザー作成) - 成功時: true を返す / 失敗時: false
  async signup(email: string, password: string) {
    const res = await apiClient.post<SignupResponse, SignupRequest>(API_ENDPOINTS.AUTH_SIGNUP, {
      username: email,
      password,
    });
    return res.status === 200;
  },

  // サインアップ確認 (メールに送信されたコード)
  async confirmSignup(email: string, code: string) {
    const res = await apiClient.post<ConfirmSignupResponse, ConfirmSignupRequest>(API_ENDPOINTS.AUTH_CONFIRM_SIGNUP, {
      username: email,
      confirmationCode: code,
    });
    return res.status === 200;
  },

  // --- Actions: Logout ---------------------------------------------------
  // ローカル状態だけをクリア（サーバー側セッションは触らない）
  logout: () =>
    set(() => ({
      idToken: null,
      accessToken: null,
      refreshToken: null,
      isLoggined: false,
    })),

  // サーバーも含めログアウト（失敗してもローカルはクリア）
  async logoutApi() {
    try {
      await apiClient.post<{ success?: boolean }, Record<string, never>>(API_ENDPOINTS.AUTH_LOGOUT, {} as any);
    } catch {
      // ignore (通信エラーでもローカルはクリア)
    } finally {
      set(() => ({ idToken: null, accessToken: null, refreshToken: null, isLoggined: false }));
    }
  },
});
