export interface LoginRequest {
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
  // Either username or email must be provided
  username?: string;
  email?: string;
  password: string;
}

export interface SignupResponse {
  message: string;
}

export interface ConfirmSignupRequest {
  username: string;
  confirmationCode: string;
}

export interface ConfirmSignupResponse {
  message: string;
}
