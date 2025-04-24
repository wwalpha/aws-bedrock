import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AppController', () => {
  let appController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    appController = app.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      const mockLoginResponse = {
        AccessToken: 'mockAccessToken',
        IdToken: 'mockIdToken',
        RefreshToken: 'mockRefreshToken',
      };

      const mockRequestBody = {
        username: 'testUser',
        password: 'testPassword',
      };

      const authService = app.get<AuthService>(AuthService);
      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);

      const result = await appController.login(mockRequestBody);

      expect(authService.login).toHaveBeenCalledWith(
        mockRequestBody.username,
        mockRequestBody.password,
      );
      expect(result).toEqual({
        accessToken: mockLoginResponse.AccessToken,
        idToken: mockLoginResponse.IdToken,
        refreshToken: mockLoginResponse.RefreshToken,
      });
    });

    it('should throw BadRequestException if username or password is missing', async () => {
      const mockRequestBody = {
        username: '',
        password: '',
      };

      await expect(appController.login(mockRequestBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if login fails in AuthService', async () => {
      const mockRequestBody = {
        username: 'testUser',
        password: 'wrongPassword',
      };

      const authService = app.get<AuthService>(AuthService);
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Invalid credentials'));

      await expect(appController.login(mockRequestBody)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
  describe('logout', () => {
    it('should call AuthService.logout with the correct access token', async () => {
      const mockRequestBody = {
        accessToken: 'mockAccessToken',
      };

      const authService = app.get<AuthService>(AuthService);
      jest.spyOn(authService, 'logout').mockResolvedValue();

      await appController.logout(mockRequestBody);

      expect(authService.logout).toHaveBeenCalledWith(
        mockRequestBody.accessToken,
      );
    });

    it('should throw BadRequestException if access token is missing', async () => {
      const mockRequestBody = {
        accessToken: '',
      };

      await expect(appController.logout(mockRequestBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if logout fails in AuthService', async () => {
      const mockRequestBody = {
        accessToken: 'mockAccessToken',
      };

      const authService = app.get<AuthService>(AuthService);
      jest
        .spyOn(authService, 'logout')
        .mockRejectedValue(new Error('Logout failed'));

      await expect(appController.logout(mockRequestBody)).rejects.toThrow(
        'Logout failed',
      );
    });
  });

  describe('signup', () => {
    it('should call AuthService.signup with the correct email and password', async () => {
      const mockRequestBody = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockSignupResponse = { UserConfirmed: true };

      const authService = app.get<AuthService>(AuthService);
      jest.spyOn(authService, 'signup').mockResolvedValue(mockSignupResponse);

      const result = await appController.signup(mockRequestBody);

      expect(authService.signup).toHaveBeenCalledWith(
        mockRequestBody.email,
        mockRequestBody.password,
      );
      expect(result).toEqual(mockSignupResponse);
    });

    it('should throw BadRequestException if email or password is missing', async () => {
      const mockRequestBody = {
        email: '',
        password: '',
      };

      await expect(appController.signup(mockRequestBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if signup fails in AuthService', async () => {
      const mockRequestBody = {
        email: 'test@example.com',
        password: 'password123',
      };

      const authService = app.get<AuthService>(AuthService);
      jest
        .spyOn(authService, 'signup')
        .mockRejectedValue(new Error('Signup failed'));

      await expect(appController.signup(mockRequestBody)).rejects.toThrow(
        'Signup failed',
      );
    });
  });

  describe('confirmSignup', () => {
    it('should call AuthService.confirmSignup with the correct username and confirmation code', async () => {
      const mockRequestBody = {
        username: 'testUser',
        confirmationCode: '123456',
      };

      const authService = app.get<AuthService>(AuthService);
      jest.spyOn(authService, 'confirmSignup').mockResolvedValue();

      await appController.confirmSignup(mockRequestBody);

      expect(authService.confirmSignup).toHaveBeenCalledWith(
        mockRequestBody.username,
        mockRequestBody.confirmationCode,
      );
    });

    it('should throw BadRequestException if username or confirmation code is missing', async () => {
      const mockRequestBody = {
        username: '',
        confirmationCode: '',
      };

      await expect(
        appController.confirmSignup(mockRequestBody),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if confirmSignup fails in AuthService', async () => {
      const mockRequestBody = {
        username: 'testUser',
        confirmationCode: '123456',
      };

      const authService = app.get<AuthService>(AuthService);
      jest
        .spyOn(authService, 'confirmSignup')
        .mockRejectedValue(new Error('Confirmation failed'));

      await expect(
        appController.confirmSignup(mockRequestBody),
      ).rejects.toThrow('Confirmation failed');
    });
  });
});
