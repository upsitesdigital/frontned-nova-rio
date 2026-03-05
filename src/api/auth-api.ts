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

async function registerClient(data: ClientRegisterRequest): Promise<ClientRegisterResponse> {
  return httpPost<ClientRegisterResponse>("/auth/client/register", data);
}

export { registerClient, type ClientRegisterRequest, type ClientRegisterResponse };
