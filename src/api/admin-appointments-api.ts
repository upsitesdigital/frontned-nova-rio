import { httpAuthGet, httpAuthPatch, httpAuthPatchWithBody, httpAuthPost } from "./http-client";

const MAX_OPTIONS_LIMIT = 100;

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

interface RawEmployee {
  id: number;
  name: string;
  isActive: boolean;
}

interface RawUnit {
  id: number;
  name: string;
  isActive: boolean;
}

interface RawClient {
  id: number;
  name: string;
  status: string;
}

interface RawAdminService {
  id: number;
  name: string;
  isActive: boolean;
  allowSingle: boolean;
  allowPackage: boolean;
  allowRecurrence: boolean;
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

async function fetchEmployees(): Promise<RawEmployee[]> {
  const response = await httpAuthGet<{ data: RawEmployee[] }>(
    `/employees?limit=${MAX_OPTIONS_LIMIT}`,
  );
  return response.data;
}

async function fetchUnits(): Promise<RawUnit[]> {
  const response = await httpAuthGet<{ data: RawUnit[] }>(`/units?limit=${MAX_OPTIONS_LIMIT}`);
  return response.data;
}

async function fetchClients(): Promise<RawClient[]> {
  const response = await httpAuthGet<{ data: RawClient[] }>(`/clients?limit=${MAX_OPTIONS_LIMIT}`);
  return response.data;
}

async function fetchAdminServices(): Promise<RawAdminService[]> {
  const response = await httpAuthGet<{ data: RawAdminService[] }>(
    `/services?limit=${MAX_OPTIONS_LIMIT}`,
  );
  return response.data;
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

interface UpdateAppointmentPayload {
  date?: string;
  startTime?: string;
  duration?: number;
  recurrenceType?: "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  locationZip?: string;
  locationAddress?: string;
  notes?: string;
  employeeId?: number;
  serviceId?: number;
  packageId?: number;
  unitId?: number;
}

interface RescheduleAppointmentPayload {
  date: string;
  startTime: string;
}

async function createAdminAppointment(
  payload: CreateAppointmentPayload,
): Promise<AdminAppointmentItem> {
  return httpAuthPost<AdminAppointmentItem>("/admin/appointments", payload);
}

async function fetchAdminAppointmentById(id: number): Promise<AdminAppointmentItem> {
  return httpAuthGet<AdminAppointmentItem>(`/admin/appointments/${id}`);
}

async function updateAdminAppointment(
  id: number,
  payload: UpdateAppointmentPayload,
): Promise<AdminAppointmentItem> {
  return httpAuthPatchWithBody<AdminAppointmentItem>(`/admin/appointments/${id}`, payload);
}

async function rescheduleAdminAppointment(
  id: number,
  payload: RescheduleAppointmentPayload,
): Promise<AdminAppointmentItem> {
  return httpAuthPost<AdminAppointmentItem>(`/admin/appointments/${id}/reschedule`, payload);
}

async function cancelAdminAppointment(id: number): Promise<void> {
  return httpAuthPatch(`/admin/appointments/${id}/cancel`);
}

async function completeAdminAppointment(id: number): Promise<AdminAppointmentItem> {
  return httpAuthPatchWithBody<AdminAppointmentItem>(`/admin/appointments/${id}/complete`, {});
}

export {
  fetchAdminAppointments,
  fetchEmployees,
  fetchUnits,
  fetchClients,
  fetchAdminServices,
  createAdminAppointment,
  fetchAdminAppointmentById,
  updateAdminAppointment,
  rescheduleAdminAppointment,
  cancelAdminAppointment,
  completeAdminAppointment,
  MAX_OPTIONS_LIMIT,
  type AdminAppointmentItem,
  type AdminAppointmentsResponse,
  type ListAdminAppointmentsParams,
  type RawEmployee,
  type RawUnit,
  type RawClient,
  type RawAdminService,
  type CreateAppointmentPayload,
  type UpdateAppointmentPayload,
  type RescheduleAppointmentPayload,
};
