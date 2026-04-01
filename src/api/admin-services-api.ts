import { httpAuthDelete, httpAuthGet, httpAuthPatchWithBody, httpAuthPost } from "./http-client";

interface RawAdminService {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  icon: string | null;
  basePrice: number | string;
  allowSingle: boolean;
  allowPackage: boolean;
  allowRecurrence: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminService {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  icon: string | null;
  basePrice: number;
  allowSingle: boolean;
  allowPackage: boolean;
  allowRecurrence: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminServicesResponse {
  data: RawAdminService[];
  total: number;
  page: number;
  limit: number;
}

interface ListAdminServicesParams {
  page: number;
  limit: number;
}

interface SaveAdminServicePayload {
  name: string;
  description?: string;
  icon?: string;
  basePrice: number;
  allowSingle?: boolean;
  allowPackage?: boolean;
  allowRecurrence?: boolean;
}

function normalizeAdminService(service: RawAdminService): AdminService {
  return {
    ...service,
    basePrice: Number(service.basePrice),
  };
}

async function fetchAdminServices(
  params: ListAdminServicesParams,
  signal?: AbortSignal,
): Promise<{ data: AdminService[]; total: number; page: number; limit: number }> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  const response = await httpAuthGet<AdminServicesResponse>(
    `/services?${searchParams.toString()}`,
    signal,
  );

  return {
    ...response,
    data: response.data.map(normalizeAdminService),
  };
}

async function createAdminService(payload: SaveAdminServicePayload): Promise<AdminService> {
  const response = await httpAuthPost<RawAdminService>("/services", payload);
  return normalizeAdminService(response);
}

async function updateAdminService(id: number, payload: SaveAdminServicePayload): Promise<AdminService> {
  const response = await httpAuthPatchWithBody<RawAdminService>(`/services/${id}`, payload);
  return normalizeAdminService(response);
}

async function deleteAdminService(id: number): Promise<void> {
  await httpAuthDelete<void>(`/services/${id}`);
}

export {
  fetchAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  type AdminService,
  type SaveAdminServicePayload,
  type ListAdminServicesParams,
};
