import { HttpClient } from "@/api/core/http-client";

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

class ProfileApi {
  static fetchClientProfile(): Promise<ClientProfile> {
    return HttpClient.authGet<ClientProfile>("/clients/profile");
  }

  static updateClientProfile(data: UpdateProfileData): Promise<ClientProfile> {
    return HttpClient.authPatchWithBody<ClientProfile>("/clients/profile", data);
  }

  static async requestEmailChange(newEmail: string): Promise<void> {
    await HttpClient.authPost<void>("/clients/profile/email/request-change", { newEmail });
  }

  static async verifyEmailChange(code: string, newEmail: string): Promise<void> {
    await HttpClient.authPost<void>("/clients/profile/email/verify-change", { code, newEmail });
  }

  static async requestPasswordChange(): Promise<void> {
    await HttpClient.authPost<void>("/clients/profile/password/request-change", {});
  }

  static async verifyPasswordChange(code: string, newPassword: string): Promise<void> {
    await HttpClient.authPost<void>("/clients/profile/password/verify-change", {
      code,
      newPassword,
    });
  }

  static async deleteClientAccount(confirmPhrase: string): Promise<void> {
    await HttpClient.authPost<void>("/clients/profile/delete-account", { confirmPhrase });
  }
}

export { ProfileApi, type ClientProfile, type UpdateProfileData };
