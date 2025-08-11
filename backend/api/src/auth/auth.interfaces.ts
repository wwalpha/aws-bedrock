export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  username: string;
}

export interface ResetPasswordResponse {
  message: string;
}
export interface LoginRequest {
  // username is the user's email address
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  accessToken: string;
}

export interface SignupRequest {
  // Email is required and will also be used as the Cognito username
  username: string;
  email?: string;
  password: string;
}

export interface SignupResponse {
  userConfirmed: boolean;
  userSub: string;
}

export interface ConfirmSignupRequest {
  // username is the user's email address
  username: string;
  confirmationCode: string;
}

export interface ConfirmSignupResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}
