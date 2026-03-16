import { fetchClientProfile, type ClientProfile } from "@/api/profile-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

type LoadClientProfileResult =
  | { success: true; profile: ClientProfile }
  | { success: false; error: string };

async function loadClientProfile(): Promise<LoadClientProfileResult> {
  try {
    const profile = await fetchClientProfile();
    return { success: true, profile };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.profile.loadError),
    };
  }
}

export { loadClientProfile, type LoadClientProfileResult };
