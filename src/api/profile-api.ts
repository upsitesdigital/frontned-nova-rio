import { httpAuthGet, httpAuthPost, httpAuthPatchWithBody } from "./http-client";

interface ClientProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  company: string | null;
  cpfCnpj: string | null;
  address: string | null;
  status: string;
  createdAt: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  company?: string;
  cpfCnpj?: string;
  address?: string;
}

async function fetchClientProfile(token: string): Promise<ClientProfile> {
  return httpAuthGet<ClientProfile>("/clients/profile", token);
}

async function updateClientProfile(
  token: string,
  data: UpdateProfileData,
): Promise<ClientProfile> {
  return httpAuthPatchWithBody<ClientProfile>("/clients/profile", data, token);
}

async function requestEmailChange(token: string, newEmail: string): Promise<void> {
  await httpAuthPost<void>("/clients/profile/email/request-change", { newEmail }, token);
}

async function verifyEmailChange(
  token: string,
  code: string,
  newEmail: string,
): Promise<void> {
  await httpAuthPost<void>("/clients/profile/email/verify-change", { code, newEmail }, token);
}

async function requestPasswordChange(token: string): Promise<void> {
  await httpAuthPost<void>("/clients/profile/password/request-change", {}, token);
}

async function verifyPasswordChange(
  token: string,
  code: string,
  newPassword: string,
): Promise<void> {
  await httpAuthPost<void>(
    "/clients/profile/password/verify-change",
    { code, newPassword },
    token,
  );
}

async function deleteClientAccount(token: string, confirmPhrase: string): Promise<void> {
  await httpAuthPost<void>("/clients/profile/delete-account", { confirmPhrase }, token);
}

export {
  fetchClientProfile,
  updateClientProfile,
  requestEmailChange,
  verifyEmailChange,
  requestPasswordChange,
  verifyPasswordChange,
  deleteClientAccount,
  type ClientProfile,
  type UpdateProfileData,
};
