import {
  fetchAdminClients,
  type AdminClient,
  type ListAdminClientsParams,
} from "@/api/admin-clients-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";
import type { DsClientTableClient, DsClientTableStatus } from "@/design-system";

interface LoadAdminClientsInput {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

interface AdminClientsLoadResult {
  data: { clients: DsClientTableClient[]; total: number } | null;
  error: string | null;
  isAuthError: boolean;
}

const STATUS_MAP: Record<string, DsClientTableStatus> = {
  ACTIVE: "active",
  PENDING: "pending",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function mapClient(client: AdminClient): DsClientTableClient {
  return {
    id: String(client.id),
    name: client.name,
    company: client.company ?? "—",
    document: client.cpfCnpj ?? "—",
    unit: client.unit?.name ?? "—",
    status: STATUS_MAP[client.status] ?? "pending",
    registrationDate: formatDate(client.createdAt),
    email: client.email,
  };
}

async function loadAdminClients(
  input: LoadAdminClientsInput,
): Promise<AdminClientsLoadResult> {
  try {
    const params: ListAdminClientsParams = {
      page: input.page,
      limit: input.limit,
    };
    if (input.status && input.status !== "all") {
      params.status = input.status.toUpperCase() as ListAdminClientsParams["status"];
    }
    if (input.search) {
      params.search = input.search;
    }

    const response = await fetchAdminClients(params);

    return {
      data: {
        clients: response.data.map(mapClient),
        total: response.total,
      },
      error: null,
      isAuthError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminClients.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminClients, type LoadAdminClientsInput, type AdminClientsLoadResult };
