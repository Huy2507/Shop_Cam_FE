export interface LoginRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
  accessFrom: string;
}

export interface VerifyResetCodeRequest {
  code: string;
  email: string;
  accessFrom: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
  accessFrom: string;
}

