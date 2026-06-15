import { ProfileApi, type ClientProfile, type UpdateProfileData } from "@/api/client/profile-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

type UpdateClientProfileResult =
  | { success: true; profile: ClientProfile }
  | { success: false; error: string };

class UpdateClientProfile {
  static async updateProfile(data: UpdateProfileData): Promise<UpdateClientProfileResult> {
    try {
      const profile = await ProfileApi.updateClientProfile(data);
      return { success: true, profile };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.profile.saveError),
      };
    }
  }
}

export { UpdateClientProfile, type UpdateClientProfileResult };
