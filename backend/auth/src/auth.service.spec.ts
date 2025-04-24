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

    it('should throw an error if login fails', async () => {
      cognitoMock
        .on(InitiateAuthCommand)
        .rejects(new Error('Invalid credentials'));

      await expect(
        authService.login('testUser', 'wrongPassword'),
      ).rejects.toThrow('Login failed: Invalid credentials');

      expect(cognitoMock.calls()).toHaveLength(1);
    });
  });

  describe('logout', () => {
    it('should call GlobalSignOutCommand on successful logout', async () => {
      cognitoMock.on(GlobalSignOutCommand).resolves({});

      await authService.logout('mockAccessToken');

      expect(cognitoMock.calls()).toHaveLength(1);
      expect(cognitoMock.call(0).args[0]).toBeInstanceOf(GlobalSignOutCommand);
    });

    it('should throw an error if logout fails', async () => {
      cognitoMock.on(GlobalSignOutCommand).rejects(new Error('Logout failed'));

      await expect(authService.logout('mockAccessToken')).rejects.toThrow(
        'Logout failed: Logout failed',
      );

      expect(cognitoMock.calls()).toHaveLength(1);
    });
  });

  describe('signup', () => {
    it('should return response on successful signup', async () => {
      const mockResponse = { UserConfirmed: true };

      cognitoMock.on(SignUpCommand).resolves(mockResponse);

      const result = await authService.signup(
        'test@example.com',
        'password123',
      );

      expect(cognitoMock.calls()).toHaveLength(1);
      expect(cognitoMock.call(0).args[0]).toBeInstanceOf(SignUpCommand);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if signup fails', async () => {
      cognitoMock.on(SignUpCommand).rejects(new Error('Signup failed'));

      await expect(
        authService.signup('test@example.com', 'password123'),
      ).rejects.toThrow('Signup failed: Signup failed');

      expect(cognitoMock.calls()).toHaveLength(1);
    });
  });

  describe('confirmSignup', () => {
    it('should confirm user successfully', async () => {
      cognitoMock.on(ConfirmSignUpCommand).resolves({});

      await authService.confirmSignup('testUser', '123456');

      expect(cognitoMock.calls()).toHaveLength(1);
      expect(cognitoMock.call(0).args[0]).toBeInstanceOf(ConfirmSignUpCommand);
    });

    it('should throw an error if confirmation fails', async () => {
      cognitoMock
        .on(ConfirmSignUpCommand)
        .rejects(new Error('Confirmation failed'));

      await expect(
        authService.confirmSignup('testUser', '123456'),
      ).rejects.toThrow('Failed to confirm user: Confirmation failed');

      expect(cognitoMock.calls()).toHaveLength(1);
    });
  });
});
