// Auth related request/response types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any;
}

// Signup
export interface SignupRequest {
  username: string;
  password: string;
}

export interface SignupResponse {
  userId?: string;
  username?: string;
  message?: string;
  [key: string]: any;
}

// Confirm Signup (verification code)
export interface ConfirmSignupRequest {
  username: string;
  confirmationCode: string;
}

export interface ConfirmSignupResponse {
  confirmed?: boolean;
  message?: string;
  [key: string]: any;
}
