import { HttpClient } from "@/api/core/http-client";

interface AdminUnit {
  id: number;
  uuid: string;
  name: string;
  address: string | null;
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  cep: string | null;
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
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  serviceRadiusKm?: number;
}

class AdminUnitsApi {
  static async fetchAdminUnits(
    params: ListAdminUnitsParams,
    signal?: AbortSignal,
  ): Promise<AdminUnitsResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });

    return HttpClient.authGet<AdminUnitsResponse>(`/units?${searchParams.toString()}`, signal);
  }

  static async createAdminUnit(payload: SaveAdminUnitPayload): Promise<AdminUnit> {
    return HttpClient.authPost<AdminUnit>("/units", payload);
  }

  static async updateAdminUnit(
    id: number,
    payload: Partial<SaveAdminUnitPayload>,
  ): Promise<AdminUnit> {
    return HttpClient.authPatchWithBody<AdminUnit>(`/units/${id}`, payload);
  }

  static async deleteAdminUnit(id: number): Promise<void> {
    await HttpClient.authDelete<void>(`/units/${id}`);
  }
}

export { AdminUnitsApi, type AdminUnit, type ListAdminUnitsParams, type SaveAdminUnitPayload };
