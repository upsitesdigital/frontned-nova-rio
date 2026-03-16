import { httpAuthGet, httpAuthPatchWithBody } from "./http-client";

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

async function fetchAdminEmployees(
  params: ListAdminEmployeesParams,
  signal?: AbortSignal,
): Promise<AdminEmployeesResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  return httpAuthGet<AdminEmployeesResponse>(`/employees?${searchParams.toString()}`, signal);
}

async function fetchAdminEmployeeById(id: number): Promise<AdminEmployee> {
  return httpAuthGet<AdminEmployee>(`/employees/${id}`);
}

async function updateAdminEmployee(
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
  return httpAuthPatchWithBody<AdminEmployee>(`/employees/${id}`, data);
}

export {
  fetchAdminEmployees,
  fetchAdminEmployeeById,
  updateAdminEmployee,
  type AdminEmployee,
  type AdminEmployeesResponse,
  type ListAdminEmployeesParams,
  type EmployeeStatus,
};
