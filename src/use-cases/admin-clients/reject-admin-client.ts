import { AdminClientsApi } from "@/api/admin/admin-clients-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface RejectAdminClientResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class RejectAdminClient {
  static async rejectAdminClient(clientId: string): Promise<RejectAdminClientResult> {
    try {
      await AdminClientsApi.rejectAdminClient(clientId);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminClients.rejectError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { RejectAdminClient, type RejectAdminClientResult };
