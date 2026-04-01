import { fetchAdminSalesSummary, type AdminReportBaseFilters } from "@/api/admin-reports-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface LoadAdminSalesSummaryInput extends AdminReportBaseFilters {
  signal?: AbortSignal;
}

interface AdminSalesSummaryData {
  totalRevenue: number;
  totalPayments: number;
  averageTicket: number;
}

interface LoadAdminSalesSummaryResult {
  data: AdminSalesSummaryData | null;
  error: string | null;
  isAuthError: boolean;
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function loadAdminSalesSummary(
  input: LoadAdminSalesSummaryInput,
): Promise<LoadAdminSalesSummaryResult> {
  try {
    const response = await fetchAdminSalesSummary(input, input.signal);

    return {
      data: {
        totalRevenue: toNumber(response.totalRevenue),
        totalPayments: toNumber(response.totalPayments),
        averageTicket: toNumber(response.averageTicket),
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
      error: resolveErrorMessage(error, MESSAGES.adminReports.summaryLoadError),
      isAuthError: isAuthError(error),
    };
  }
}

export {
  loadAdminSalesSummary,
  type LoadAdminSalesSummaryInput,
  type AdminSalesSummaryData,
  type LoadAdminSalesSummaryResult,
};