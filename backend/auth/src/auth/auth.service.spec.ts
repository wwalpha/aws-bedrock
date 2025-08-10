import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

describe('AuthService', () => {
  let authService: AuthService;
  const cognitoMock = mockClient(CognitoIdentityProviderClient);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    cognitoMock.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return AuthenticationResult on successful login', async () => {
      const mockResponse = {
        AuthenticationResult: {
          AccessToken: 'mockAccessToken',
          IdToken: 'mockIdToken',
          RefreshToken: 'mockRefreshToken',
        },
      };

      cognitoMock.on(InitiateAuthCommand).resolves(mockResponse);

      const result = await authService.login('testUser', 'testPassword');

      expect(cognitoMock.calls()).toHaveLength(1);
      expect(cognitoMock.call(0).args[0]).toBeInstanceOf(InitiateAuthCommand);
      expect(result).toEqual(mockResponse.AuthenticationResult);
    });
  });

  describe('logout', () => {
    it('should call GlobalSignOutCommand on successful logout', async () => {
      cognitoMock.on(GlobalSignOutCommand).resolves({});

      await authService.logout('mockAccessToken');

      expect(cognitoMock.calls()).toHaveLength(1);
      expect(cognitoMock.call(0).args[0]).toBeInstanceOf(GlobalSignOutCommand);
    });
  });

  describe('signup', () => {
    it('should return response on successful signup with username=email', async () => {
      const mockResponse = { UserConfirmed: true };

      cognitoMock.on(SignUpCommand).resolves(mockResponse);

      const result = await authService.signup(
        'test@example.com',
        'password123',
        'test@example.com',
      );

      expect(cognitoMock.calls()).toHaveLength(1);
      expect(cognitoMock.call(0).args[0]).toBeInstanceOf(SignUpCommand);
      expect(result).toEqual(mockResponse);
    });

    it('should include email attribute defaulting to username when email not provided', async () => {
      const mockResponse = { UserConfirmed: false };

      cognitoMock.on(SignUpCommand).resolves(mockResponse);

      const result = await authService.signup(
        'user@example.com',
        'password123',
      );

      expect(cognitoMock.calls()).toHaveLength(1);
      const sent = cognitoMock.call(0).args[0] as any;
      expect(sent.input.Username).toBe('user@example.com');
      expect(sent.input.UserAttributes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ Name: 'email', Value: 'user@example.com' }),
        ]),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('confirmSignup', () => {
    it('should confirm user successfully', async () => {
      cognitoMock.on(ConfirmSignUpCommand).resolves({});

      await authService.confirmSignup('testUser', '123456');

      expect(cognitoMock.calls()).toHaveLength(1);
      expect(cognitoMock.call(0).args[0]).toBeInstanceOf(ConfirmSignUpCommand);
    });
  });
});
