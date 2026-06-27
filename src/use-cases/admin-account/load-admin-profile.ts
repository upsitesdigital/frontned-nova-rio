import { AdminProfileApi, type AdminProfile } from "@/api/admin/admin-profile-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

type LoadAdminProfileResult =
  | { success: true; profile: AdminProfile }
  | { success: false; error: string };

class LoadAdminProfile {
  static async loadAdminProfile(): Promise<LoadAdminProfileResult> {
    try {
      const profile = await AdminProfileApi.fetchAdminProfile();
      return { success: true, profile };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.profile.loadError),
      };
    }
  }
}

export { LoadAdminProfile, type LoadAdminProfileResult };
