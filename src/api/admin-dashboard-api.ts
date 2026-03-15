import { httpAuthGet } from "./http-client";

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

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

async function fetchAdminProfile(): Promise<AdminProfile> {
  return httpAuthGet<AdminProfile>("/auth/me");
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
): Promise<TodayAgendaResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (serviceId) params.set("serviceId", String(serviceId));
  return httpAuthGet<TodayAgendaResponse>(`/admin/dashboard/today-agenda?${params.toString()}`);
}

interface ServiceOption {
  id: number;
  name: string;
}

async function fetchServices(): Promise<ServiceOption[]> {
  const response = await httpAuthGet<{ data: { id: number; name: string; isActive: boolean }[] }>(
    "/services",
  );
  return response.data.filter((s) => s.isActive).map((s) => ({ id: s.id, name: s.name }));
}

export {
  fetchAdminProfile,
  fetchTodayAppointmentsCount,
  fetchActiveClientsCount,
  fetchPendingAppointmentsCount,
  fetchTodayAgenda,
  fetchServices,
  type AdminProfile,
  type AgendaItem,
  type TodayAgendaResponse,
  type ServiceOption,
};
