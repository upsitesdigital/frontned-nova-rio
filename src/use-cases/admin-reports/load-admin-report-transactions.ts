import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AdminReportsApi,
  type AdminReportGroupBy,
  type AdminTransactionGroupItem,
} from "@/api/admin/admin-reports-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface LoadAdminReportTransactionsInput {
  dateFrom?: string;
  dateTo?: string;
  unitId?: number;
  serviceId?: number;
  groupBy: AdminReportGroupBy;
  signal?: AbortSignal;
}

interface ReportChartPoint {
  label: string;
  value: number;
}

interface LoadAdminReportTransactionsResult {
  data: ReportChartPoint[] | null;
  error: string | null;
  isAuthError: boolean;
}

function formatPeriodLabel(period: string, groupBy: AdminReportGroupBy): string {
  const parsed = parseISO(period);
  if (!isValid(parsed)) {
    return period;
  }

  if (groupBy === "day") {
    return format(parsed, "dd/MM", { locale: ptBR });
  }

  if (groupBy === "week") {
    return `Sem ${format(parsed, "dd/MM", { locale: ptBR })}`;
  }

  return format(parsed, "MMM/yy", { locale: ptBR });
}

function mapTransactionsToChart(
  transactions: AdminTransactionGroupItem[],
  groupBy: AdminReportGroupBy,
): ReportChartPoint[] {
  return transactions.map((item) => ({
    label: formatPeriodLabel(item.period, groupBy),
    value: Number(item.total),
  }));
}

class LoadAdminReportTransactions {
  static async loadAdminReportTransactions(
    input: LoadAdminReportTransactionsInput,
  ): Promise<LoadAdminReportTransactionsResult> {
    try {
      const response = await AdminReportsApi.fetchAdminTransactions(
        {
          dateFrom: input.dateFrom,
          dateTo: input.dateTo,
          unitId: input.unitId,
          serviceId: input.serviceId,
          groupBy: input.groupBy,
        },
        input.signal,
      );

      return {
        data: mapTransactionsToChart(response, input.groupBy),
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      if (input.signal?.aborted) {
        return { data: null, error: null, isAuthError: false };
      }

      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminReports.transactionsLoadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  LoadAdminReportTransactions,
  type LoadAdminReportTransactionsInput,
  type LoadAdminReportTransactionsResult,
  type ReportChartPoint,
};
