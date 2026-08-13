import { HttpClient } from "@/api/core/http-client";

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UpdateAdminProfileData {
  name?: string;
}

class AdminProfileApi {
  static fetchAdminProfile(): Promise<AdminProfile> {
    return HttpClient.authGet<AdminProfile>("/admin-profile");
  }

  static updateAdminProfile(data: UpdateAdminProfileData): Promise<AdminProfile> {
    return HttpClient.authPatchWithBody<AdminProfile>("/admin-profile", data);
  }

  static async requestEmailChange(newEmail: string): Promise<void> {
    await HttpClient.authPost<void>("/admin-profile/email/request-change", { newEmail });
  }

  static async verifyEmailChange(code: string, newEmail: string): Promise<void> {
    await HttpClient.authPost<void>("/admin-profile/email/verify-change", { code, newEmail });
  }

  static async requestPasswordChange(): Promise<void> {
    await HttpClient.authPost<void>("/admin-profile/password/request-change", {});
  }

  static async verifyPasswordChange(code: string, newPassword: string): Promise<void> {
    await HttpClient.authPost<void>("/admin-profile/password/verify-change", {
      code,
      newPassword,
    });
  }
}

export { AdminProfileApi, type AdminProfile, type UpdateAdminProfileData };
