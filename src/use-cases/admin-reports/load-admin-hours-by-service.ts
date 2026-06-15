import { AdminReportsApi } from "@/api/admin/admin-reports-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface LoadAdminHoursByServiceInput {
  dateFrom?: string;
  dateTo?: string;
  unitId?: number;
  signal?: AbortSignal;
}

interface ReportChartPoint {
  label: string;
  value: number;
}

interface LoadAdminHoursByServiceResult {
  data: ReportChartPoint[] | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminHoursByService {
  static async loadAdminHoursByService(
    input: LoadAdminHoursByServiceInput,
  ): Promise<LoadAdminHoursByServiceResult> {
    try {
      const response = await AdminReportsApi.fetchAdminHoursByService(
        {
          dateFrom: input.dateFrom,
          dateTo: input.dateTo,
          unitId: input.unitId,
        },
        input.signal,
      );

      return {
        data: response.map((item) => ({
          label: item.serviceName,
          value: Number((item.totalMinutes / 60).toFixed(1)),
        })),
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      if (input.signal?.aborted) {
        return { data: null, error: null, isAuthError: false };
      }

      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(
          error,
          Messages.adminReports.hoursByServiceLoadError,
        ),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminHoursByService, type LoadAdminHoursByServiceInput, type ReportChartPoint };
