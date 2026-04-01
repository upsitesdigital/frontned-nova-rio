import { create } from "zustand";

import type { AdminReportGroupBy } from "@/api/admin-reports-api";
import { formatDateToISO } from "@/lib/date-helpers";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { exportAdminTransactionsCsv } from "@/use-cases/export-admin-transactions-csv";
import {
  getActiveUnitOptions,
  type UnitOption,
} from "@/use-cases/get-active-unit-options";
import { loadAdminActiveClients } from "@/use-cases/load-admin-active-clients";
import { loadAdminHoursByService } from "@/use-cases/load-admin-hours-by-service";
import { loadAdminReportTransactions } from "@/use-cases/load-admin-report-transactions";
import {
  loadAdminSalesSummary,
  type AdminSalesSummaryData,
} from "@/use-cases/load-admin-sales-summary";

type ReportsChartMode = "revenue" | "hours";
type ReportsPeriodFilter = "30d" | "90d" | "180d" | "365d";

interface ReportsChartPoint {
  label: string;
  value: number;
}

interface AdminReportsState {
  summary: AdminSalesSummaryData | null;
  activeClientsTotal: number;
  totalHoursSold: number;
  chartData: ReportsChartPoint[];
  chartMode: ReportsChartMode;
  periodFilter: ReportsPeriodFilter;
  unitFilter: string;
  unitOptions: UnitOption[];
  isLoading: boolean;
  isChartLoading: boolean;
  isOptionsLoading: boolean;
  isExporting: boolean;
  error: string | null;
  chartError: string | null;
  isAuthError: boolean;
}

interface AdminReportsActions {
  initialize: () => Promise<void>;
  loadOverview: () => Promise<void>;
  loadChart: () => Promise<void>;
  loadUnitOptions: () => Promise<void>;
  setChartMode: (mode: ReportsChartMode) => void;
  setPeriodFilter: (period: ReportsPeriodFilter) => void;
  setUnitFilter: (unitFilter: string) => void;
  exportCsv: () => Promise<boolean>;
  reset: () => void;
}

type AdminReportsStore = AdminReportsState & AdminReportsActions;

const DAYS_BY_PERIOD: Record<ReportsPeriodFilter, number> = {
  "30d": 29,
  "90d": 89,
  "180d": 179,
  "365d": 364,
};

const initialState: AdminReportsState = {
  summary: null,
  activeClientsTotal: 0,
  totalHoursSold: 0,
  chartData: [],
  chartMode: "revenue",
  periodFilter: "30d",
  unitFilter: "all",
  unitOptions: [],
  isLoading: false,
  isChartLoading: false,
  isOptionsLoading: false,
  isExporting: false,
  error: null,
  chartError: null,
  isAuthError: false,
};

let overviewAbortController: AbortController | null = null;
let chartAbortController: AbortController | null = null;

function buildDateRange(period: ReportsPeriodFilter): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const dateFrom = new Date(now);
  dateFrom.setDate(now.getDate() - DAYS_BY_PERIOD[period]);

  return {
    dateFrom: formatDateToISO(dateFrom),
    dateTo: formatDateToISO(now),
  };
}

function resolveGroupBy(period: ReportsPeriodFilter): AdminReportGroupBy {
  if (period === "30d") return "day";
  if (period === "90d") return "week";
  return "month";
}

function parseUnitFilter(unitFilter: string): number | undefined {
  if (unitFilter === "all") return undefined;

  const parsed = Number(unitFilter);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildCommonFilters(state: AdminReportsState): {
  dateFrom: string;
  dateTo: string;
  unitId?: number;
} {
  const { dateFrom, dateTo } = buildDateRange(state.periodFilter);

  return {
    dateFrom,
    dateTo,
    unitId: parseUnitFilter(state.unitFilter),
  };
}

const useAdminReportsStore = create<AdminReportsStore>()((set, get) => ({
  ...initialState,

  initialize: async () => {
    await Promise.all([get().loadUnitOptions(), get().loadOverview(), get().loadChart()]);
  },

  loadOverview: async () => {
    overviewAbortController?.abort();
    overviewAbortController = new AbortController();
    const { signal } = overviewAbortController;

    const commonFilters = buildCommonFilters(get());

    set({ isLoading: true, error: null, isAuthError: false });

    const [summaryResult, activeClientsResult, hoursResult] = await Promise.all([
      loadAdminSalesSummary({ ...commonFilters, signal }),
      loadAdminActiveClients({ unitId: commonFilters.unitId, signal }),
      loadAdminHoursByService({ ...commonFilters, signal }),
    ]);

    if (signal.aborted) {
      return;
    }

    const totalHoursSold = (hoursResult.data ?? []).reduce((total, item) => total + item.value, 0);

    set({
      summary: summaryResult.data ?? get().summary,
      activeClientsTotal: activeClientsResult.data?.totalActive ?? get().activeClientsTotal,
      totalHoursSold,
      isLoading: false,
      error: summaryResult.error ?? activeClientsResult.error ?? hoursResult.error,
      isAuthError:
        summaryResult.isAuthError || activeClientsResult.isAuthError || hoursResult.isAuthError,
    });
  },

  loadChart: async () => {
    chartAbortController?.abort();
    chartAbortController = new AbortController();
    const { signal } = chartAbortController;

    const state = get();
    const commonFilters = buildCommonFilters(state);

    set({ isChartLoading: true, chartError: null, isAuthError: false });

    if (state.chartMode === "revenue") {
      const result = await loadAdminReportTransactions({
        ...commonFilters,
        groupBy: resolveGroupBy(state.periodFilter),
        signal,
      });

      if (signal.aborted) {
        return;
      }

      set({
        chartData: result.data ?? [],
        chartError: result.error,
        isChartLoading: false,
        isAuthError: result.isAuthError,
      });
      return;
    }

    const result = await loadAdminHoursByService({
      dateFrom: commonFilters.dateFrom,
      dateTo: commonFilters.dateTo,
      unitId: commonFilters.unitId,
      signal,
    });

    if (signal.aborted) {
      return;
    }

    set({
      chartData: result.data ?? [],
      chartError: result.error,
      isChartLoading: false,
      isAuthError: result.isAuthError,
    });
  },

  loadUnitOptions: async () => {
    set({ isOptionsLoading: true });

    const result = await getActiveUnitOptions();

    set({
      unitOptions: result.data ?? [],
      isOptionsLoading: false,
    });
  },

  setChartMode: (mode) => {
    set({ chartMode: mode });
    void get().loadChart();
  },

  setPeriodFilter: (periodFilter) => {
    set({ periodFilter });
    void Promise.all([get().loadOverview(), get().loadChart()]);
  },

  setUnitFilter: (unitFilter) => {
    set({ unitFilter });
    void Promise.all([get().loadOverview(), get().loadChart()]);
  },

  exportCsv: async () => {
    if (get().isExporting) {
      return false;
    }

    set({ isExporting: true, isAuthError: false });

    const commonFilters = buildCommonFilters(get());
    const result = await exportAdminTransactionsCsv(commonFilters);

    if (result.success) {
      useToastStore.getState().showToast(MESSAGES.adminReports.exportSuccess, "success");
    } else {
      useToastStore
        .getState()
        .showToast(result.error ?? MESSAGES.adminReports.exportError, "error");
    }

    set({ isExporting: false, isAuthError: result.isAuthError });
    return result.success;
  },

  reset: () => {
    overviewAbortController?.abort();
    chartAbortController?.abort();
    overviewAbortController = null;
    chartAbortController = null;
    set(initialState);
  },
}));

export {
  useAdminReportsStore,
  type AdminReportsStore,
  type ReportsChartMode,
  type ReportsPeriodFilter,
  type ReportsChartPoint,
};