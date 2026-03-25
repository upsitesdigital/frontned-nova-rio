import { rejectAdminClient as apiReject } from "@/api/admin-clients-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface RejectAdminClientResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function rejectAdminClient(clientId: string): Promise<RejectAdminClientResult> {
  try {
    await apiReject(clientId);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminClients.rejectError),
      isAuthError: isAuthError(error),
    };
  }
}

export { rejectAdminClient, type RejectAdminClientResult };
