export namespace Auth {
  type LoginRequest = {
    username: string;
    password: string;
  };

  type LoginResponse = {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  };

  type LogoutRequest = {
    accessToken: string;
  };

  type SignupRequest = {
    email: string;
    password: string;
  };

  type SignupResponse = {
    message: string;
  };

  type ConfirmSignupRequest = {
    username: string;
    confirmationCode: string;
  };

  type ConfirmSignupResponse = {
    message: string;
  };
}
