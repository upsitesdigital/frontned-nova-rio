import {
  updateClientProfile,
  type ClientProfile,
  type UpdateProfileData,
} from "@/api/profile-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

type UpdateClientProfileResult =
  | { success: true; profile: ClientProfile }
  | { success: false; error: string };

async function updateProfile(
  data: UpdateProfileData,
): Promise<UpdateClientProfileResult> {
  try {
    const profile = await updateClientProfile(data);
    return { success: true, profile };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.profile.saveError),
    };
  }
}

export { updateProfile, type UpdateClientProfileResult };
