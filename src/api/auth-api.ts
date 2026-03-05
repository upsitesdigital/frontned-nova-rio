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
}

async function registerClient(data: ClientRegisterRequest): Promise<ClientRegisterResponse> {
  return httpPost<ClientRegisterResponse>("/auth/client/register", data);
}

async function loginClient(data: ClientLoginRequest): Promise<TokenPair> {
  return httpPost<TokenPair>("/auth/client/login", data);
}

export {
  registerClient,
  loginClient,
  type ClientRegisterRequest,
  type ClientRegisterResponse,
  type ClientLoginRequest,
  type TokenPair,
};
