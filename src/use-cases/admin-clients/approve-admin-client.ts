import { AdminClientsApi } from "@/api/admin/admin-clients-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface ApproveAdminClientResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class ApproveAdminClient {
  static async approveAdminClient(clientId: string): Promise<ApproveAdminClientResult> {
    try {
      await AdminClientsApi.approveAdminClient(clientId);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminClients.approveError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { ApproveAdminClient, type ApproveAdminClientResult };
