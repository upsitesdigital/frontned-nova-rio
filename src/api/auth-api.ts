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

interface ClientLoginResponse {
  accessToken: string;
}

async function registerClient(data: ClientRegisterRequest): Promise<ClientRegisterResponse> {
  return httpPost<ClientRegisterResponse>("/auth/client/register", data);
}

async function loginClient(data: ClientLoginRequest): Promise<ClientLoginResponse> {
  return httpPost<ClientLoginResponse>("/auth/client/login", data);
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

export {
  registerClient,
  loginClient,
  requestPasswordReset,
  resetPassword,
  type ClientRegisterRequest,
  type ClientRegisterResponse,
  type ClientLoginRequest,
  type ClientLoginResponse,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
};
