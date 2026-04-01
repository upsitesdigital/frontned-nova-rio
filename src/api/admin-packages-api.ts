import { httpAuthDelete, httpAuthGet, httpAuthPatch, httpAuthPatchWithBody, httpAuthPost } from "./http-client";

interface RawAdminPackage {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  totalHours: number | null;
  price: number | string;
  serviceId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminPackage {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  totalHours: number | null;
  price: number;
  serviceId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminPackagesResponse {
  data: RawAdminPackage[];
  total: number;
  page: number;
  limit: number;
}

interface ListAdminPackagesParams {
  page: number;
  limit: number;
  active?: boolean;
  serviceId?: number;
}

interface SaveAdminPackagePayload {
  name: string;
  description?: string;
  totalHours?: number;
  price: number;
  serviceId: number;
}

function normalizeAdminPackage(item: RawAdminPackage): AdminPackage {
  return {
    ...item,
    price: Number(item.price),
  };
}

async function fetchAdminPackages(
  params: ListAdminPackagesParams,
  signal?: AbortSignal,
): Promise<{ data: AdminPackage[]; total: number; page: number; limit: number }> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.active !== undefined) searchParams.set("active", String(params.active));
  if (params.serviceId) searchParams.set("serviceId", String(params.serviceId));

  const response = await httpAuthGet<AdminPackagesResponse>(
    `/packages?${searchParams.toString()}`,
    signal,
  );

  return {
    ...response,
    data: response.data.map(normalizeAdminPackage),
  };
}

async function createAdminPackage(payload: SaveAdminPackagePayload): Promise<AdminPackage> {
  const response = await httpAuthPost<RawAdminPackage>("/packages", payload);
  return normalizeAdminPackage(response);
}

async function updateAdminPackage(
  id: number,
  payload: Partial<SaveAdminPackagePayload>,
): Promise<AdminPackage> {
  const response = await httpAuthPatchWithBody<RawAdminPackage>(`/packages/${id}`, payload);
  return normalizeAdminPackage(response);
}

async function deactivateAdminPackage(id: number): Promise<void> {
  await httpAuthDelete<void>(`/packages/${id}`);
}

async function reactivateAdminPackage(id: number): Promise<void> {
  await httpAuthPatch(`/packages/${id}/reactivate`);
}

export {
  fetchAdminPackages,
  createAdminPackage,
  updateAdminPackage,
  deactivateAdminPackage,
  reactivateAdminPackage,
  type AdminPackage,
  type ListAdminPackagesParams,
  type SaveAdminPackagePayload,
};
