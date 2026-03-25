import { approveAdminClient as apiApprove } from "@/api/admin-clients-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface ApproveAdminClientResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function approveAdminClient(clientId: string): Promise<ApproveAdminClientResult> {
  try {
    await apiApprove(clientId);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminClients.approveError),
      isAuthError: isAuthError(error),
    };
  }
}

export { approveAdminClient, type ApproveAdminClientResult };
