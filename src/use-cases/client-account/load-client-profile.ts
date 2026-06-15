import { ProfileApi, type ClientProfile } from "@/api/client/profile-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

type LoadClientProfileResult =
  | { success: true; profile: ClientProfile }
  | { success: false; error: string };

class LoadClientProfile {
  static async loadClientProfile(): Promise<LoadClientProfileResult> {
    try {
      const profile = await ProfileApi.fetchClientProfile();
      return { success: true, profile };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.profile.loadError),
      };
    }
  }
}

export { LoadClientProfile, type LoadClientProfileResult };
