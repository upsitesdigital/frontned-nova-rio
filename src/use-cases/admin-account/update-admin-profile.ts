import {
  AdminProfileApi,
  type AdminProfile,
  type UpdateAdminProfileData,
} from "@/api/admin/admin-profile-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

type UpdateAdminProfileResult =
  { success: true; profile: AdminProfile } | { success: false; error: string };

class UpdateAdminProfile {
  static async updateProfile(data: UpdateAdminProfileData): Promise<UpdateAdminProfileResult> {
    try {
      const profile = await AdminProfileApi.updateAdminProfile(data);
      return { success: true, profile };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.profile.saveError),
      };
    }
  }
}

export { UpdateAdminProfile, type UpdateAdminProfileResult };
