import { AdminPaymentsApi } from "@/api/admin/admin-payments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface CancelAdminPaymentResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class CancelAdminPayment {
  static async cancelAdminPayment(id: number): Promise<CancelAdminPaymentResult> {
    try {
      await AdminPaymentsApi.cancelAdminPayment(id);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminPayments.cancelError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { CancelAdminPayment, type CancelAdminPaymentResult };
