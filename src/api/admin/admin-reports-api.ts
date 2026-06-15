import { HttpClient } from "@/api/core/http-client";

type AdminReportGroupBy = "day" | "week" | "month";

interface AdminReportBaseFilters {
  dateFrom?: string;
  dateTo?: string;
  unitId?: number;
  serviceId?: number;
}

interface AdminSalesSummaryResponse {
  totalRevenue: number | string;
  totalPayments: number;
  averageTicket: number | string;
}

interface AdminActiveClientsByUnit {
  unitId: number;
  unitName: string;
  count: number;
}

interface AdminActiveClientsResponse {
  totalActive: number;
  byUnit: AdminActiveClientsByUnit[];
}

interface AdminHoursByServiceItem {
  serviceId: number;
  serviceName: string;
  totalMinutes: number;
}

interface AdminTransactionGroupItem {
  period: string;
  total: number;
  count: number;
}

interface AdminTransactionsParams extends AdminReportBaseFilters {
  groupBy?: AdminReportGroupBy;
}

class AdminReportsApi {
  private static appendBaseFilters(
    searchParams: URLSearchParams,
    filters: AdminReportBaseFilters,
  ): void {
    if (filters.dateFrom) searchParams.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) searchParams.set("dateTo", filters.dateTo);
    if (filters.unitId) searchParams.set("unitId", String(filters.unitId));
    if (filters.serviceId) searchParams.set("serviceId", String(filters.serviceId));
  }

  static async fetchAdminSalesSummary(
    filters: AdminReportBaseFilters,
    signal?: AbortSignal,
  ): Promise<AdminSalesSummaryResponse> {
    const searchParams = new URLSearchParams();
    AdminReportsApi.appendBaseFilters(searchParams, filters);
    const query = searchParams.toString();
    return HttpClient.authGet<AdminSalesSummaryResponse>(
      `/admin/reports/sales-summary${query ? `?${query}` : ""}`,
      signal,
    );
  }

  static async fetchAdminActiveClients(
    filters: Pick<AdminReportBaseFilters, "unitId">,
    signal?: AbortSignal,
  ): Promise<AdminActiveClientsResponse> {
    const searchParams = new URLSearchParams();
    if (filters.unitId) searchParams.set("unitId", String(filters.unitId));
    const query = searchParams.toString();
    return HttpClient.authGet<AdminActiveClientsResponse>(
      `/admin/reports/active-clients${query ? `?${query}` : ""}`,
      signal,
    );
  }

  static async fetchAdminHoursByService(
    filters: Pick<AdminReportBaseFilters, "dateFrom" | "dateTo" | "unitId">,
    signal?: AbortSignal,
  ): Promise<AdminHoursByServiceItem[]> {
    const searchParams = new URLSearchParams();
    if (filters.dateFrom) searchParams.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) searchParams.set("dateTo", filters.dateTo);
    if (filters.unitId) searchParams.set("unitId", String(filters.unitId));

    const query = searchParams.toString();
    return HttpClient.authGet<AdminHoursByServiceItem[]>(
      `/admin/reports/hours-by-service${query ? `?${query}` : ""}`,
      signal,
    );
  }

  static async fetchAdminTransactions(
    params: AdminTransactionsParams,
    signal?: AbortSignal,
  ): Promise<AdminTransactionGroupItem[]> {
    const searchParams = new URLSearchParams();
    AdminReportsApi.appendBaseFilters(searchParams, params);
    if (params.groupBy) searchParams.set("groupBy", params.groupBy);

    return HttpClient.authGet<AdminTransactionGroupItem[]>(
      `/admin/reports/transactions?${searchParams.toString()}`,
      signal,
    );
  }

  static async fetchAdminTransactionsExportCsv(filters: AdminReportBaseFilters): Promise<Blob> {
    const searchParams = new URLSearchParams();
    AdminReportsApi.appendBaseFilters(searchParams, filters);
    const query = searchParams.toString();
    return HttpClient.authGetBlob(`/admin/reports/export${query ? `?${query}` : ""}`);
  }
}

export {
  AdminReportsApi,
  type AdminReportGroupBy,
  type AdminReportBaseFilters,
  type AdminSalesSummaryResponse,
  type AdminActiveClientsByUnit,
  type AdminActiveClientsResponse,
  type AdminHoursByServiceItem,
  type AdminTransactionGroupItem,
  type AdminTransactionsParams,
};
