import { HttpClient } from "@/api/core/http-client";

interface CountResponse {
  count: number;
}

interface AgendaItem {
  appointmentId: number;
  clientName: string;
  serviceName: string;
  startTime: string;
  duration: number;
  status: string;
  date: string;
}

interface TodayAgendaResponse {
  items: AgendaItem[];
  total: number;
  page: number;
  limit: number;
}

interface RawServiceItem {
  id: number;
  name: string;
  isActive: boolean;
}

class AdminDashboardApi {
  static async fetchTodayAppointmentsCount(): Promise<CountResponse> {
    return HttpClient.authGet<CountResponse>("/admin/dashboard/today-appointments-count");
  }

  static async fetchActiveClientsCount(): Promise<CountResponse> {
    return HttpClient.authGet<CountResponse>("/admin/dashboard/active-clients-count");
  }

  static async fetchPendingAppointmentsCount(): Promise<CountResponse> {
    return HttpClient.authGet<CountResponse>("/admin/dashboard/pending-appointments-count");
  }

  static async fetchTodayAgenda(
    page: number,
    limit: number,
    serviceId?: number,
    signal?: AbortSignal,
  ): Promise<TodayAgendaResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (serviceId !== undefined) params.set("serviceId", String(serviceId));
    return HttpClient.authGet<TodayAgendaResponse>(
      `/admin/dashboard/today-agenda?${params.toString()}`,
      signal,
    );
  }

  static async fetchAdminDashboardServices(): Promise<RawServiceItem[]> {
    const response = await HttpClient.authGet<{ data: RawServiceItem[] }>("/services");
    return response.data;
  }
}

export {
  AdminDashboardApi,
  type AgendaItem,
  type TodayAgendaResponse,
  type RawServiceItem,
};
