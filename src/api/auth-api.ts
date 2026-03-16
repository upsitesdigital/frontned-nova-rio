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

interface ClientLoginRequest {
  email: string;
  password: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  userType: "client" | "admin";
}

async function registerClient(data: ClientRegisterRequest): Promise<ClientRegisterResponse> {
  return httpPost<ClientRegisterResponse>("/auth/client/register", data);
}

async function loginClient(data: ClientLoginRequest): Promise<TokenPair> {
  return httpPost<TokenPair>("/auth/login", data);
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
  loginClient,
  refreshTokens,
  requestPasswordReset,
  resetPassword,
  type ClientRegisterRequest,
  type ClientRegisterResponse,
  type ClientLoginRequest,
  type TokenPair,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
};
