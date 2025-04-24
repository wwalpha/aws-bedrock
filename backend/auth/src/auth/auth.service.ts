import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  private cognitoClient = new CognitoIdentityProviderClient();
  COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

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
  async signup(email: string, password: string): Promise<SignUpCommandOutput> {
    const params: SignUpCommandInput = {
      ClientId: this.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    const response = await this.cognitoClient.send(new SignUpCommand(params));
    // サインアップ結果を返す
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
