import { httpAuthGet, httpAuthPost } from "./http-client";

interface AdminAppointmentItem {
  id: number;
  uuid: string;
  date: string;
  startTime: string;
  duration: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  recurrenceType: "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  locationZip: string | null;
  locationAddress: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client: { id: number; name: string; email: string };
  service: { id: number; name: string };
  employee: { id: number; name: string } | null;
  package: { id: number; name: string } | null;
  unit: { id: number; name: string } | null;
}

interface AdminAppointmentsResponse {
  data: AdminAppointmentItem[];
  total: number;
  page: number;
  limit: number;
}

interface ListAdminAppointmentsParams {
  page: number;
  limit: number;
  date?: string;
  weekStart?: string;
  weekEnd?: string;
  employeeId?: number;
  unitId?: number;
  status?: string;
}

interface EmployeeOption {
  id: number;
  name: string;
}

interface UnitOption {
  id: number;
  name: string;
}

async function fetchAdminAppointments(
  params: ListAdminAppointmentsParams,
  signal?: AbortSignal,
): Promise<AdminAppointmentsResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.date) searchParams.set("date", params.date);
  if (params.weekStart) searchParams.set("weekStart", params.weekStart);
  if (params.weekEnd) searchParams.set("weekEnd", params.weekEnd);
  if (params.employeeId) searchParams.set("employeeId", String(params.employeeId));
  if (params.unitId) searchParams.set("unitId", String(params.unitId));
  if (params.status) searchParams.set("status", params.status);

  return httpAuthGet<AdminAppointmentsResponse>(
    `/admin/appointments?${searchParams.toString()}`,
    signal,
  );
}

async function fetchEmployeeOptions(): Promise<EmployeeOption[]> {
  const response = await httpAuthGet<{
    data: { id: number; name: string; isActive: boolean }[];
  }>("/employees?limit=100");
  return response.data.filter((e) => e.isActive).map((e) => ({ id: e.id, name: e.name }));
}

async function fetchUnitOptions(): Promise<UnitOption[]> {
  const response = await httpAuthGet<{
    data: { id: number; name: string; isActive: boolean }[];
  }>("/units?limit=100");
  return response.data.filter((u) => u.isActive).map((u) => ({ id: u.id, name: u.name }));
}

interface ClientOption {
  id: number;
  name: string;
}

async function fetchClientOptions(): Promise<ClientOption[]> {
  const response = await httpAuthGet<{
    data: { id: number; name: string; status: string }[];
  }>("/clients?limit=100");
  return response.data
    .filter((c) => c.status === "APPROVED")
    .map((c) => ({ id: c.id, name: c.name }));
}

interface ServiceOption {
  id: number;
  name: string;
  allowSingle: boolean;
  allowPackage: boolean;
  allowRecurrence: boolean;
}

async function fetchServiceOptions(): Promise<ServiceOption[]> {
  const response = await httpAuthGet<{
    data: {
      id: number;
      name: string;
      isActive: boolean;
      allowSingle: boolean;
      allowPackage: boolean;
      allowRecurrence: boolean;
    }[];
  }>("/services?limit=100");
  return response.data
    .filter((s) => s.isActive)
    .map((s) => ({
      id: s.id,
      name: s.name,
      allowSingle: s.allowSingle,
      allowPackage: s.allowPackage,
      allowRecurrence: s.allowRecurrence,
    }));
}

interface CreateAppointmentPayload {
  date: string;
  startTime: string;
  duration: number;
  recurrenceType?: string;
  locationZip?: string;
  notes?: string;
  clientId: number;
  employeeId?: number;
  serviceId: number;
}

async function createAdminAppointment(
  payload: CreateAppointmentPayload,
): Promise<AdminAppointmentItem> {
  return httpAuthPost<AdminAppointmentItem>("/admin/appointments", payload);
}

export {
  fetchAdminAppointments,
  fetchEmployeeOptions,
  fetchUnitOptions,
  fetchClientOptions,
  fetchServiceOptions,
  createAdminAppointment,
  type AdminAppointmentItem,
  type AdminAppointmentsResponse,
  type ListAdminAppointmentsParams,
  type EmployeeOption,
  type UnitOption,
  type ClientOption,
  type ServiceOption,
  type CreateAppointmentPayload,
};
