import { httpAuthDelete, httpAuthGet, httpAuthPatchWithBody, httpAuthPost } from "./http-client";

interface AdminUnit {
  id: number;
  uuid: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number;
  createdAt: string;
  updatedAt: string;
}

interface AdminUnitsResponse {
  data: AdminUnit[];
  total: number;
  page: number;
  limit: number;
}

interface ListAdminUnitsParams {
  page: number;
  limit: number;
}

interface SaveAdminUnitPayload {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  serviceRadiusKm?: number;
}

async function fetchAdminUnits(
  params: ListAdminUnitsParams,
  signal?: AbortSignal,
): Promise<AdminUnitsResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  return httpAuthGet<AdminUnitsResponse>(`/units?${searchParams.toString()}`, signal);
}

async function createAdminUnit(payload: SaveAdminUnitPayload): Promise<AdminUnit> {
  return httpAuthPost<AdminUnit>("/units", payload);
}

async function updateAdminUnit(id: number, payload: Partial<SaveAdminUnitPayload>): Promise<AdminUnit> {
  return httpAuthPatchWithBody<AdminUnit>(`/units/${id}`, payload);
}

async function deleteAdminUnit(id: number): Promise<void> {
  await httpAuthDelete<void>(`/units/${id}`);
}

export {
  fetchAdminUnits,
  createAdminUnit,
  updateAdminUnit,
  deleteAdminUnit,
  type AdminUnit,
  type ListAdminUnitsParams,
  type SaveAdminUnitPayload,
};
