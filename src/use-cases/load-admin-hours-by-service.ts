import { fetchAdminHoursByService } from "@/api/admin-reports-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

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

async function loadAdminHoursByService(
  input: LoadAdminHoursByServiceInput,
): Promise<LoadAdminHoursByServiceResult> {
  try {
    const response = await fetchAdminHoursByService(
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
      error: resolveErrorMessage(error, MESSAGES.adminReports.hoursByServiceLoadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminHoursByService, type LoadAdminHoursByServiceInput, type ReportChartPoint };