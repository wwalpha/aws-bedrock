import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmSignupRequest,
  ConfirmSignupResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  SignupRequest,
  SignupResponse,
  LogoutResponse,
} from './auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    // リクエストボディのバリデーション
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    // Cognitoのログイン処理を呼び出す
    const response = await this.authService.login(body.username, body.password);

    return {
      accessToken: response.AccessToken!,
      idToken: response.IdToken!,
      refreshToken: response.RefreshToken!,
    };
  }

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

  @Post('signup')
  async signup(@Body() body: SignupRequest): Promise<SignupResponse> {
    // Require email and password; username will be email
    const email = (body.username || '').trim();
    if (!email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    const res = await this.authService.signup(email, body.password, email);
    return {
      userConfirmed: !!res.UserConfirmed,
      userSub: res.UserSub || '',
    };
  }

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
