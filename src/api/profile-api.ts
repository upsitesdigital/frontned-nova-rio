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

async function fetchClientProfile(): Promise<ClientProfile> {
  return httpAuthGet<ClientProfile>("/clients/profile");
}

async function updateClientProfile(data: UpdateProfileData): Promise<ClientProfile> {
  return httpAuthPatchWithBody<ClientProfile>("/clients/profile", data);
}

async function requestEmailChange(newEmail: string): Promise<void> {
  await httpAuthPost<void>("/clients/profile/email/request-change", { newEmail });
}

async function verifyEmailChange(code: string, newEmail: string): Promise<void> {
  await httpAuthPost<void>("/clients/profile/email/verify-change", { code, newEmail });
}

async function requestPasswordChange(): Promise<void> {
  await httpAuthPost<void>("/clients/profile/password/request-change", {});
}

async function verifyPasswordChange(code: string, newPassword: string): Promise<void> {
  await httpAuthPost<void>("/clients/profile/password/verify-change", { code, newPassword });
}

async function deleteClientAccount(confirmPhrase: string): Promise<void> {
  await httpAuthPost<void>("/clients/profile/delete-account", { confirmPhrase });
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
