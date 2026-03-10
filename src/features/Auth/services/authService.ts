import api from "@services/axiosConfig";
import { User } from "../../../hooks/useAuth";
import {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  VerifyResetCodeRequest,
} from "../types/auth";

export const verifyLoginOTP = async (otp: string) => {
  try {
    const response = await api.post("/api/Auth/verify-login-otp", {
      otp,
      accessFrom: "dashboard",
    });
    return response.data;
  } catch (error) {
    console.error("Error during OTP verification:", error);
    throw error;
  }
};

export const login = async (credentials: LoginRequest) => {
  try {
    const response = await api.post("/api/Auth/login/dashboard", credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post(
      `/api/Auth/refresh-token?accessFrom=dashboard`,
    );
    return response.data;
  } catch (error) {
    console.error("Error during token refresh:", error);
    throw error;
  }
};

export const resendOTP = async (
  username: string,
  isForgotPassword: boolean,
) => {
  try {
    const response = await api.post("/api/Auth/resend-otp", {
      username,
      accessFrom: "dashboard",
      isForgotPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error during OTP resend:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/api/Auth/forgot-password", {
      email,
      accessFrom: "dashboard",
    } as ForgotPasswordRequest);
    return response.data;
  } catch (error) {
    console.error("Error during forgot password:", error);
    throw error;
  }
};

export const verifyResetCode = async (code: string, email: string) => {
  try {
    const response = await api.post("/api/Auth/verify-reset-code", {
      code,
      email,
      accessFrom: "dashboard",
    } as VerifyResetCodeRequest);
    return response.data;
  } catch (error) {
    console.error("Error during reset code verification:", error);
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
  confirmPassword: string,
) => {
  try {
    const response = await api.post("/api/Auth/reset-password", {
      email,
      code,
      newPassword,
      confirmPassword,
      accessFrom: "dashboard",
    } as ResetPasswordRequest);
    return response.data;
  } catch (error) {
    console.error("Error during password reset:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get("/api/Users/current-user");
    if (response.data.succeeded) {
      return response.data.value;
    } else {
      throw new Error(
        response.data.errors?.[0] || "Failed to get current user info.",
      );
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/api/Auth/logout");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

