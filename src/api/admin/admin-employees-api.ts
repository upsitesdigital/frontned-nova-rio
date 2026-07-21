import { HttpClient } from "@/api/core/http-client";

type EmployeeStatus = "ACTIVE" | "INACTIVE";

interface AdminEmployee {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string;
  address: string | null;
  avatarUrl: string | null;
  status: EmployeeStatus;
  availabilityFrom: string | null;
  availabilityTo: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  unit: { id: number; name: string } | null;
}

interface AdminEmployeesResponse {
  data: AdminEmployee[];
  total: number;
  page: number;
  limit: number;
}

interface ListAdminEmployeesParams {
  page: number;
  limit: number;
  status?: EmployeeStatus;
  search?: string;
}

class AdminEmployeesApi {
  static async fetchAdminEmployees(
    params: ListAdminEmployeesParams,
    signal?: AbortSignal,
  ): Promise<AdminEmployeesResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });

    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);

    return HttpClient.authGet<AdminEmployeesResponse>(
      `/employees?${searchParams.toString()}`,
      signal,
    );
  }

  static async fetchAdminEmployeeById(id: number): Promise<AdminEmployee> {
    return HttpClient.authGet<AdminEmployee>(`/employees/${id}`);
  }

  static async createAdminEmployee(
    data: Pick<
      AdminEmployee,
      "name" | "email" | "cpf" | "phone" | "address" | "availabilityFrom" | "availabilityTo"
    > & {
      notes?: string | null;
      unitId?: number | null;
    },
  ): Promise<AdminEmployee> {
    const body = {
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.address ? { address: data.address } : {}),
      ...(data.availabilityFrom ? { availabilityFrom: data.availabilityFrom } : {}),
      ...(data.availabilityTo ? { availabilityTo: data.availabilityTo } : {}),
      ...(data.notes ? { notes: data.notes } : {}),
      ...(data.unitId ? { unitId: data.unitId } : {}),
    };
    return HttpClient.authPost<AdminEmployee>("/employees", body);
  }

  static async updateAdminEmployee(
    id: number,
    data: Partial<
      Pick<
        AdminEmployee,
        | "name"
        | "email"
        | "cpf"
        | "phone"
        | "address"
        | "availabilityFrom"
        | "availabilityTo"
        | "notes"
        | "status"
      >
    > & { unitId?: number },
  ): Promise<AdminEmployee> {
    const body = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null && value !== undefined),
    );
    return HttpClient.authPatchWithBody<AdminEmployee>(`/employees/${id}`, body);
  }
}

export {
  AdminEmployeesApi,
  type AdminEmployee,
  type AdminEmployeesResponse,
  type ListAdminEmployeesParams,
  type EmployeeStatus,
};
