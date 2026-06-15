import {
  AdminPaymentsApi,
  type AdminPayment,
  type AdminPaymentMethod,
  type AdminPaymentStatus,
  type ListAdminPaymentsParams,
} from "@/api/admin/admin-payments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

type AdminPaymentsFilter = "all" | AdminPaymentStatus;
type AdminPaymentsMethodFilter = "all" | AdminPaymentMethod;

interface LoadAdminPaymentsInput {
  page: number;
  pageSize: number;
  statusFilter: AdminPaymentsFilter;
  methodFilter: AdminPaymentsMethodFilter;
  dateFrom?: string;
  dateTo?: string;
  signal?: AbortSignal;
}

interface AdminPaymentsLoadResult {
  data: { payments: AdminPayment[]; total: number; page: number } | null;
  error: string | null;
  isAuthError: boolean;
}

function buildQueryParams(input: LoadAdminPaymentsInput): ListAdminPaymentsParams {
  const params: ListAdminPaymentsParams = {
    page: input.page,
    limit: input.pageSize,
  };

  if (input.statusFilter !== "all") {
    params.status = input.statusFilter;
  }

  if (input.methodFilter !== "all") {
    params.method = input.methodFilter;
  }

  if (input.dateFrom) {
    params.dateFrom = input.dateFrom;
  }

  if (input.dateTo) {
    params.dateTo = input.dateTo;
  }

  return params;
}

class LoadAdminPayments {
  static async loadAdminPayments(input: LoadAdminPaymentsInput): Promise<AdminPaymentsLoadResult> {
    try {
      const params = buildQueryParams(input);
      const response = await AdminPaymentsApi.fetchAdminPayments(params, input.signal);

      return {
        data: {
          payments: response.data,
          total: response.total,
          page: response.page,
        },
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      if (input.signal?.aborted) {
        return { data: null, error: null, isAuthError: false };
      }

      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminPayments.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  LoadAdminPayments,
  type LoadAdminPaymentsInput,
  type AdminPaymentsLoadResult,
  type AdminPaymentsFilter,
  type AdminPaymentsMethodFilter,
};
