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
import { withLoadingErrorCurried } from '@/store/utils';

// 認証 / アプリ共通状態用 Slice
// - トークンの保持と更新
// - ログイン / ログアウト API 呼び出し
// - 既存トークンでの状態再構築
export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (set: SliceSet<AppSlice>) => {
  // 共通: auth系APIでloading/errorを自動制御
  const withAuthApi = withLoadingErrorCurried(set as any, 'authLoading', 'authMessage');

  return {
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

    // 認証系 API のロード状態 / エラーメッセージ
    authLoading: false,
    authMessage: null,

    // --- Actions: Auth Flow -----------------------------------------------
    // ログイン処理 (成功時のみ state 更新。失敗時は axios が throw する想定)
    login: withAuthApi(async (email: string, password: string) => {
      const res = await apiClient.post<LoginResponse, LoginRequest>(API_ENDPOINTS.AUTH_LOGIN, {
        username: email,
        password,
      });
      set(() => ({
        idToken: res.data.idToken || null,
        accessToken: res.data.accessToken || null,
        refreshToken: res.data.refreshToken || null,
        isLoggined: true,
        authMessage: 'Logged in successfully',
      }));
    }),

    // サインアップ (state 更新のみ / 戻り値なし)
    signup: withAuthApi(async (email: string, password: string) => {
      await apiClient.post<SignupResponse, SignupRequest>(API_ENDPOINTS.AUTH_SIGNUP, { username: email, password });
      set(() => ({ authMessage: 'Account created. Please verify your email.' }));
    }),

    // サインアップ確認 (state 更新不要 / 戻り値なし)
    confirmSignup: withAuthApi(async (email: string, code: string) => {
      await apiClient.post<ConfirmSignupResponse, ConfirmSignupRequest>(API_ENDPOINTS.AUTH_CONFIRM_SIGNUP, {
        username: email,
        confirmationCode: code,
      });
      set(() => ({ authMessage: 'Verification successful. You can now log in.' }));
    }),

    // --- Actions: Logout ---------------------------------------------------
    // ローカル状態だけをクリア（サーバー側セッションは触らない）
    logout: () =>
      set(() => ({
        idToken: null,
        accessToken: null,
        refreshToken: null,
        isLoggined: false,
        authMessage: 'Logged out',
      })),

    // サーバーも含めログアウト（失敗してもローカルはクリア）
    logoutApi: withAuthApi(async () => {
      try {
        await apiClient.post<{ success?: boolean }, Record<string, never>>(API_ENDPOINTS.AUTH_LOGOUT, {} as any);
      } finally {
        set(() => ({
          idToken: null,
          accessToken: null,
          refreshToken: null,
          isLoggined: false,
          authMessage: 'Logged out',
        }));
      }
    }),
  };
};
