import { HttpClient } from "@/api/core/http-client";

interface ClientRegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface ClientRegisterResponse {
  message: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

type UserType = "client" | "admin";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userType: UserType;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  userType: "client" | "admin";
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

class AuthApi {
  static registerClient(data: ClientRegisterRequest): Promise<ClientRegisterResponse> {
    return HttpClient.post<ClientRegisterResponse>("/auth/client/register", data);
  }

  static login(data: LoginRequest): Promise<LoginResponse> {
    return HttpClient.post<LoginResponse>("/auth/login", data);
  }

  static requestPasswordReset(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return HttpClient.post<ForgotPasswordResponse>("/auth/forgot-password", data);
  }

  static resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return HttpClient.post<ResetPasswordResponse>("/auth/reset-password", data);
  }

  static fetchAdminProfile(): Promise<AdminProfile> {
    return HttpClient.authGet<AdminProfile>("/auth/me");
  }
}

export {
  AuthApi,
  type ClientRegisterRequest,
  type ClientRegisterResponse,
  type LoginRequest,
  type LoginResponse,
  type UserType,
  type TokenPair,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type AdminProfile,
};
