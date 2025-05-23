import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmSignupRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  SignupRequest,
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
  async logout(@Body() body: LogoutRequest): Promise<void> {
    // リクエストボディのバリデーション
    if (!body.accessToken) {
      throw new BadRequestException('Access token is required');
    }

    // Cognitoのログアウト処理を呼び出す
    await this.authService.logout(body.accessToken);
  }

  @Post('signup')
  async signup(@Body() body: SignupRequest) {
    // リクエストボディのバリデーション
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    // Cognitoのサインアップ処理を呼び出す
    return this.authService.signup(body.email, body.password);
  }

  @Post('confirmSignup')
  async confirmSignup(@Body() body: ConfirmSignupRequest) {
    // リクエストボディのバリデーション
    if (!body.username || !body.confirmationCode) {
      throw new BadRequestException(
        'Username and confirmation code are required',
      );
    }

    // Cognitoのサインアップ確認処理を呼び出す
    return this.authService.confirmSignup(body.username, body.confirmationCode);
  }
}
