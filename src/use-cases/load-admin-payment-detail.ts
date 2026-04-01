import { fetchAdminPaymentById, type AdminPayment } from "@/api/admin-payments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface LoadAdminPaymentDetailResult {
  data: AdminPayment | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminPaymentDetail(id: number): Promise<LoadAdminPaymentDetailResult> {
  try {
    const payment = await fetchAdminPaymentById(id);
    return { data: payment, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminPayments.detailError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminPaymentDetail, type LoadAdminPaymentDetailResult };
