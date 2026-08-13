import { HttpClient } from "@/api/core/http-client";

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

class AdminPackagesApi {
  private static normalizeAdminPackage(item: RawAdminPackage): AdminPackage {
    return {
      ...item,
      price: Number(item.price),
    };
  }

  static async fetchAdminPackages(
    params: ListAdminPackagesParams,
    signal?: AbortSignal,
  ): Promise<{ data: AdminPackage[]; total: number; page: number; limit: number }> {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });

    if (params.active !== undefined) searchParams.set("active", String(params.active));
    if (params.serviceId) searchParams.set("serviceId", String(params.serviceId));

    const response = await HttpClient.authGet<AdminPackagesResponse>(
      `/packages?${searchParams.toString()}`,
      signal,
    );

    return {
      ...response,
      data: response.data.map(AdminPackagesApi.normalizeAdminPackage),
    };
  }

  static async createAdminPackage(payload: SaveAdminPackagePayload): Promise<AdminPackage> {
    const response = await HttpClient.authPost<RawAdminPackage>("/packages", payload);
    return AdminPackagesApi.normalizeAdminPackage(response);
  }

  static async updateAdminPackage(
    id: number,
    payload: Partial<SaveAdminPackagePayload>,
  ): Promise<AdminPackage> {
    const response = await HttpClient.authPatchWithBody<RawAdminPackage>(
      `/packages/${id}`,
      payload,
    );
    return AdminPackagesApi.normalizeAdminPackage(response);
  }

  static async deactivateAdminPackage(id: number): Promise<void> {
    await HttpClient.authDelete<void>(`/packages/${id}`);
  }

  static async reactivateAdminPackage(id: number): Promise<void> {
    await HttpClient.authPatch(`/packages/${id}/reactivate`);
  }
}

export {
  AdminPackagesApi,
  type AdminPackage,
  type ListAdminPackagesParams,
  type SaveAdminPackagePayload,
};
