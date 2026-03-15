import { httpPost } from "./http-client";

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
}

async function registerClient(data: ClientRegisterRequest): Promise<ClientRegisterResponse> {
  return httpPost<ClientRegisterResponse>("/auth/client/register", data);
}

async function login(data: LoginRequest): Promise<LoginResponse> {
  return httpPost<LoginResponse>("/auth/login", data);
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

async function requestPasswordReset(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return httpPost<ForgotPasswordResponse>("/auth/forgot-password", data);
}

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  return httpPost<ResetPasswordResponse>("/auth/reset-password", data);
}

async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  return httpPost<TokenPair>("/auth/refresh", { refreshToken });
}

export {
  registerClient,
  login,
  refreshTokens,
  requestPasswordReset,
  resetPassword,
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
};
