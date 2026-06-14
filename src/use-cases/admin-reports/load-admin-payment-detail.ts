import { AdminPaymentsApi, type AdminPayment } from "@/api/admin/admin-payments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface LoadAdminPaymentDetailResult {
  data: AdminPayment | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminPaymentDetail {
  static async loadAdminPaymentDetail(id: number): Promise<LoadAdminPaymentDetailResult> {
    try {
      const payment = await AdminPaymentsApi.fetchAdminPaymentById(id);
      return { data: payment, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminPayments.detailError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminPaymentDetail, type LoadAdminPaymentDetailResult };
