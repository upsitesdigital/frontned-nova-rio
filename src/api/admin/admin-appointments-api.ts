import { HttpClient } from "@/api/core/http-client";

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

class AdminAppointmentsApi {
  static readonly maxOptionsLimit = 100;

  static async fetchAdminAppointments(
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

    return HttpClient.authGet<AdminAppointmentsResponse>(
      `/admin/appointments?${searchParams.toString()}`,
      signal,
    );
  }

  static async fetchEmployees(): Promise<RawEmployee[]> {
    const response = await HttpClient.authGet<{ data: RawEmployee[] }>(
      `/employees?limit=${AdminAppointmentsApi.maxOptionsLimit}`,
    );
    return response.data;
  }

  static async fetchUnits(): Promise<RawUnit[]> {
    const response = await HttpClient.authGet<{ data: RawUnit[] }>(
      `/units?limit=${AdminAppointmentsApi.maxOptionsLimit}`,
    );
    return response.data;
  }

  static async fetchClients(): Promise<RawClient[]> {
    const response = await HttpClient.authGet<{ data: RawClient[] }>(
      `/clients?limit=${AdminAppointmentsApi.maxOptionsLimit}`,
    );
    return response.data;
  }

  static async fetchAdminServices(): Promise<RawAdminService[]> {
    const response = await HttpClient.authGet<{ data: RawAdminService[] }>(
      `/services?limit=${AdminAppointmentsApi.maxOptionsLimit}`,
    );
    return response.data;
  }

  static async createAdminAppointment(
    payload: CreateAppointmentPayload,
  ): Promise<AdminAppointmentItem> {
    return HttpClient.authPost<AdminAppointmentItem>("/admin/appointments", payload);
  }

  static async fetchAdminAppointmentById(id: number): Promise<AdminAppointmentItem> {
    return HttpClient.authGet<AdminAppointmentItem>(`/admin/appointments/${id}`);
  }

  static async updateAdminAppointment(
    id: number,
    payload: UpdateAppointmentPayload,
  ): Promise<AdminAppointmentItem> {
    return HttpClient.authPatchWithBody<AdminAppointmentItem>(`/admin/appointments/${id}`, payload);
  }

  static async rescheduleAdminAppointment(
    id: number,
    payload: RescheduleAppointmentPayload,
  ): Promise<AdminAppointmentItem> {
    return HttpClient.authPost<AdminAppointmentItem>(
      `/admin/appointments/${id}/reschedule`,
      payload,
    );
  }

  static async cancelAdminAppointment(id: number): Promise<void> {
    return HttpClient.authPatch(`/admin/appointments/${id}/cancel`);
  }

  static async completeAdminAppointment(id: number): Promise<AdminAppointmentItem> {
    return HttpClient.authPatchWithBody<AdminAppointmentItem>(
      `/admin/appointments/${id}/complete`,
      {},
    );
  }
}

export {
  AdminAppointmentsApi,
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
