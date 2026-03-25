import { httpAuthGet, httpAuthPatch } from "./http-client";

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

async function fetchAdminClients(
  params: ListAdminClientsParams,
  signal?: AbortSignal,
): Promise<AdminClientsResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  return httpAuthGet<AdminClientsResponse>(`/clients?${searchParams.toString()}`, signal);
}

async function approveAdminClient(clientId: string): Promise<void> {
  await httpAuthPatch(`/clients/${clientId}/approve`);
}

async function rejectAdminClient(clientId: string): Promise<void> {
  await httpAuthPatch(`/clients/${clientId}/reject`);
}

export {
  fetchAdminClients,
  approveAdminClient,
  rejectAdminClient,
  type AdminClient,
  type AdminClientsResponse,
  type ListAdminClientsParams,
  type ClientStatus,
};
