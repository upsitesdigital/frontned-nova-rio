import {
  fetchAdminPayments,
  type AdminPayment,
  type AdminPaymentMethod,
  type AdminPaymentStatus,
  type ListAdminPaymentsParams,
} from "@/api/admin-payments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

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

async function loadAdminPayments(
  input: LoadAdminPaymentsInput,
): Promise<AdminPaymentsLoadResult> {
  try {
    const params = buildQueryParams(input);
    const response = await fetchAdminPayments(params, input.signal);

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
      error: resolveErrorMessage(error, MESSAGES.adminPayments.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export {
  loadAdminPayments,
  type LoadAdminPaymentsInput,
  type AdminPaymentsLoadResult,
  type AdminPaymentsFilter,
  type AdminPaymentsMethodFilter,
};
