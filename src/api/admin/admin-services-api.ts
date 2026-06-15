import { HttpClient } from "@/api/core/http-client";

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

class AdminServicesApi {
  private static normalizeAdminService(service: RawAdminService): AdminService {
    return {
      ...service,
      basePrice: Number(service.basePrice),
    };
  }

  static async fetchAdminServices(
    params: ListAdminServicesParams,
    signal?: AbortSignal,
  ): Promise<{ data: AdminService[]; total: number; page: number; limit: number }> {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });

    const response = await HttpClient.authGet<AdminServicesResponse>(
      `/services?${searchParams.toString()}`,
      signal,
    );

    return {
      ...response,
      data: response.data.map(AdminServicesApi.normalizeAdminService),
    };
  }

  static async createAdminService(payload: SaveAdminServicePayload): Promise<AdminService> {
    const response = await HttpClient.authPost<RawAdminService>("/services", payload);
    return AdminServicesApi.normalizeAdminService(response);
  }

  static async updateAdminService(
    id: number,
    payload: SaveAdminServicePayload,
  ): Promise<AdminService> {
    const response = await HttpClient.authPatchWithBody<RawAdminService>(
      `/services/${id}`,
      payload,
    );
    return AdminServicesApi.normalizeAdminService(response);
  }

  static async deleteAdminService(id: number): Promise<void> {
    await HttpClient.authDelete<void>(`/services/${id}`);
  }
}

export {
  AdminServicesApi,
  type AdminService,
  type SaveAdminServicePayload,
  type ListAdminServicesParams,
};
