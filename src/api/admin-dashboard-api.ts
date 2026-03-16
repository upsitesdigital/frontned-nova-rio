import { httpAuthGet } from "./http-client";

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

async function fetchTodayAppointmentsCount(): Promise<CountResponse> {
  return httpAuthGet<CountResponse>("/admin/dashboard/today-appointments-count");
}

async function fetchActiveClientsCount(): Promise<CountResponse> {
  return httpAuthGet<CountResponse>("/admin/dashboard/active-clients-count");
}

async function fetchPendingAppointmentsCount(): Promise<CountResponse> {
  return httpAuthGet<CountResponse>("/admin/dashboard/pending-appointments-count");
}

async function fetchTodayAgenda(
  page: number,
  limit: number,
  serviceId?: number,
  signal?: AbortSignal,
): Promise<TodayAgendaResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (serviceId !== undefined) params.set("serviceId", String(serviceId));
  return httpAuthGet<TodayAgendaResponse>(
    `/admin/dashboard/today-agenda?${params.toString()}`,
    signal,
  );
}

interface RawServiceItem {
  id: number;
  name: string;
  isActive: boolean;
}

async function fetchAdminDashboardServices(): Promise<RawServiceItem[]> {
  const response = await httpAuthGet<{ data: RawServiceItem[] }>("/services");
  return response.data;
}

export {
  fetchTodayAppointmentsCount,
  fetchActiveClientsCount,
  fetchPendingAppointmentsCount,
  fetchTodayAgenda,
  fetchAdminDashboardServices,
  type AgendaItem,
  type TodayAgendaResponse,
  type RawServiceItem,
};
