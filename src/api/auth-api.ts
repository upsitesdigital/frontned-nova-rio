import { httpAuthGet, httpPost } from "./http-client";

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

async function registerClient(data: ClientRegisterRequest): Promise<ClientRegisterResponse> {
  return httpPost<ClientRegisterResponse>("/auth/client/register", data);
}

interface RawLoginResponse {
  accessToken: string;
  refreshToken: string;
  userType?: UserType;
}

function normalizeLoginResponse(raw: RawLoginResponse, fallbackUserType: UserType): LoginResponse {
  return {
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    userType: raw.userType ?? fallbackUserType,
  };
}

async function login(data: LoginRequest): Promise<LoginResponse> {
  // Compatibility flow:
  // 1) Try split routes used by older backend containers.
  // 2) Fallback to unified /auth/login used by newer backend code.
  // This keeps login working without forcing immediate backend container rebuild.
  try {
    const admin = await httpPost<RawLoginResponse>("/auth/admin/login", data);
    return normalizeLoginResponse(admin, "admin");
  } catch {
    // Ignore and continue to next path.
  }

  try {
    const client = await httpPost<RawLoginResponse>("/auth/client/login", data);
    return normalizeLoginResponse(client, "client");
  } catch {
    // Ignore and continue to next path.
  }

  const unified = await httpPost<RawLoginResponse>("/auth/login", data);
  return normalizeLoginResponse(unified, "client");
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

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

async function fetchAdminProfile(): Promise<AdminProfile> {
  return httpAuthGet<AdminProfile>("/auth/me");
}

export {
  registerClient,
  login,
  refreshTokens,
  requestPasswordReset,
  resetPassword,
  fetchAdminProfile,
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
