import { AdminReportsApi, type AdminReportBaseFilters } from "@/api/admin/admin-reports-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

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

class LoadAdminSalesSummary {
  static async loadAdminSalesSummary(
    input: LoadAdminSalesSummaryInput,
  ): Promise<LoadAdminSalesSummaryResult> {
    try {
      const response = await AdminReportsApi.fetchAdminSalesSummary(input, input.signal);

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
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminReports.summaryLoadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  LoadAdminSalesSummary,
  type LoadAdminSalesSummaryInput,
  type AdminSalesSummaryData,
  type LoadAdminSalesSummaryResult,
};
