import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  fetchAdminTransactions,
  type AdminReportGroupBy,
  type AdminTransactionGroupItem,
} from "@/api/admin-reports-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

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

async function loadAdminReportTransactions(
  input: LoadAdminReportTransactionsInput,
): Promise<LoadAdminReportTransactionsResult> {
  try {
    const response = await fetchAdminTransactions(
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
      error: resolveErrorMessage(error, MESSAGES.adminReports.transactionsLoadError),
      isAuthError: isAuthError(error),
    };
  }
}

export {
  loadAdminReportTransactions,
  type LoadAdminReportTransactionsInput,
  type LoadAdminReportTransactionsResult,
  type ReportChartPoint,
};