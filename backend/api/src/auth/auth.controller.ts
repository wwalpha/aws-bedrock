import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  // 認証関連のリクエスト・レスポンス型
  ConfirmSignupRequest,
  ConfirmSignupResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  SignupRequest,
  SignupResponse,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './auth.interfaces';

// 認証APIのエンドポイントをまとめたコントローラー
@Controller('auth')
export class AuthController {
  // 認証サービスをDI
  constructor(private readonly authService: AuthService) {}

  // アクセストークンのリフレッシュ
  @Post('refresh')
  async refresh(
    @Body() body: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    // リフレッシュトークンを使って新しいトークンを取得
    const response = await this.authService.refresh(body.refreshToken);
    return {
      accessToken: response.AccessToken!,
      idToken: response.IdToken!,
      refreshToken: response.RefreshToken!,
    };
  }

  // パスワードリセットのリクエスト
  @Post('reset')
  async reset(
    @Body() body: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    if (!body.username) {
      throw new BadRequestException('Username (email) is required');
    }
    // パスワードリセット処理を呼び出す
    await this.authService.resetPassword(body.username);
    return { message: 'Password reset initiated' };
  }

  // ログイン処理
  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    // リクエストボディのバリデーション
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    // Cognitoのログイン処理を呼び出す
    const response = await this.authService.login(body.username, body.password);

    // トークンを返却
    return {
      accessToken: response.AccessToken!,
      idToken: response.IdToken!,
      refreshToken: response.RefreshToken!,
    };
  }

  // ログアウト処理
  @Post('logout')
  async logout(@Body() body: LogoutRequest): Promise<LogoutResponse> {
    // リクエストボディのバリデーション
    if (!body.accessToken) {
      throw new BadRequestException('Access token is required');
    }

    // Cognitoのログアウト処理を呼び出す
    await this.authService.logout(body.accessToken);
    return { message: 'Logged out' };
  }

  // サインアップ処理
  @Post('signup')
  async signup(@Body() body: SignupRequest): Promise<SignupResponse> {
    // メールアドレスとパスワードが必須（usernameはemailと同じ）
    const email = (body.username || '').trim();
    if (!email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    // サインアップ処理を呼び出す
    const res = await this.authService.signup(email, body.password, email);
    return {
      userConfirmed: !!res.UserConfirmed,
      userSub: res.UserSub || '',
    };
  }

  // サインアップ確認処理
  @Post('confirmSignup')
  async confirmSignup(
    @Body() body: ConfirmSignupRequest,
  ): Promise<ConfirmSignupResponse> {
    // リクエストボディのバリデーション
    if (!body.username || !body.confirmationCode) {
      throw new BadRequestException(
        'Username and confirmation code are required',
      );
    }

    // Cognitoのサインアップ確認処理を呼び出す
    await this.authService.confirmSignup(body.username, body.confirmationCode);
    return { message: 'Signup confirmed' };
  }
}
