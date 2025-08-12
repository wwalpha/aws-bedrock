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
