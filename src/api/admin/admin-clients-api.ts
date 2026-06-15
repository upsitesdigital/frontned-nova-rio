import { HttpClient } from "@/api/core/http-client";

type ClientStatus = "ACTIVE" | "INACTIVE" | "PENDING";

interface AdminClient {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  company: string | null;
  cpfCnpj: string | null;
  address: string | null;
  complement: string | null;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
  unit: { id: number; name: string } | null;
}

interface AdminClientsResponse {
  data: AdminClient[];
  total: number;
  page: number;
  limit: number;
}

interface ListAdminClientsParams {
  page: number;
  limit: number;
  status?: ClientStatus;
  search?: string;
}

class AdminClientsApi {
  static async fetchAdminClients(
    params: ListAdminClientsParams,
    signal?: AbortSignal,
  ): Promise<AdminClientsResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });

    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);

    return HttpClient.authGet<AdminClientsResponse>(`/clients?${searchParams.toString()}`, signal);
  }

  static async approveAdminClient(clientId: string): Promise<void> {
    await HttpClient.authPatch(`/clients/${clientId}/approve`);
  }

  static async rejectAdminClient(clientId: string): Promise<void> {
    await HttpClient.authPatch(`/clients/${clientId}/reject`);
  }
}

export {
  AdminClientsApi,
  type AdminClient,
  type AdminClientsResponse,
  type ListAdminClientsParams,
  type ClientStatus,
};
