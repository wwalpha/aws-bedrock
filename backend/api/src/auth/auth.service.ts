import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Environment } from '../const/consts';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  SignUpCommand,
  SignUpCommandInput,
  InitiateAuthCommandInput,
  AuthenticationResultType,
  ConfirmSignUpCommand,
  SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
  private cognitoClient = new CognitoIdentityProviderClient({
    region: Environment.AWS_REGION,
  });
  COGNITO_CLIENT_ID = Environment.COGNITO_CLIENT_ID;

  async refresh(refreshToken: string): Promise<AuthenticationResultType> {
    const params: InitiateAuthCommandInput = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };
    const command = new InitiateAuthCommand(params);
    const response = await this.cognitoClient.send(command);
    const result = response.AuthenticationResult;
    if (!result) {
      throw new UnauthorizedException('Token refresh failed.');
    }
    return result;
  }

  async resetPassword(username: string): Promise<void> {
    const { ForgotPasswordCommand } = await import(
      '@aws-sdk/client-cognito-identity-provider'
    );
    const command = new ForgotPasswordCommand({
      ClientId: this.COGNITO_CLIENT_ID,
      Username: username,
    });
    await this.cognitoClient.send(command);
  }

  /**
   * ユーザーをログインさせます。
   * @param username - ユーザー名
   * @param password - パスワード
   * @returns ログイン結果
   */
  async login(
    username: string,
    password: string,
  ): Promise<AuthenticationResultType> {
    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const command = new InitiateAuthCommand(params);
    const response = await this.cognitoClient.send(command);
    const result = response.AuthenticationResult;

    // ログイン失敗時のエラー処理
    if (!result) {
      throw new UnauthorizedException('Login failed.');
    }

    // アクセストークンなどを返す
    return result;
  }

  /**
   * ユーザーをログアウトします。
   * @param accessToken - アクセストークン
   */
  async logout(accessToken: string): Promise<void> {
    const command = new GlobalSignOutCommand({ AccessToken: accessToken });
    await this.cognitoClient.send(command);
  }

  /**
   * ユーザーをサインアップします。
   * @param email - メールアドレス
   * @param password - パスワード
   * @returns サインアップ結果
   */
  async signup(
    username: string,
    password: string,
    email?: string,
  ): Promise<SignUpCommandOutput> {
    const attributes: { Name: string; Value: string }[] = [];
    // Ensure email attribute is set to the provided email or username when it looks like an email
    const effectiveEmail = email || username;
    if (effectiveEmail) {
      attributes.push({ Name: 'email', Value: effectiveEmail });
    }

    const params: SignUpCommandInput = {
      ClientId: this.COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: attributes,
    };

    const response = await this.cognitoClient.send(new SignUpCommand(params));
    return response;
  }

  /**
   * ユーザーの確認を行います。
   * @param username - ユーザー名
   * @param confirmationCode - 確認コード
   */
  async confirmSignup(
    username: string,
    confirmationCode: string,
  ): Promise<void> {
    const command = new ConfirmSignUpCommand({
      ClientId: this.COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: confirmationCode,
    });

    // Cognitoにユーザーの確認をリクエスト
    await this.cognitoClient.send(command);
  }
}
