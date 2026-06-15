import {
  AdminClientsApi,
  type AdminClient,
  type ListAdminClientsParams,
} from "@/api/admin/admin-clients-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

type AdminClientRowStatus = "active" | "inactive" | "pending";

interface AdminClientRow {
  id: string;
  name: string;
  company: string;
  document: string;
  unit: string;
  status: AdminClientRowStatus;
  registrationDate: string;
  email: string;
}

interface LoadAdminClientsInput {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

interface AdminClientsLoadResult {
  data: { clients: AdminClientRow[]; total: number } | null;
  error: string | null;
  isAuthError: boolean;
}

const statusMap: Record<string, AdminClientRowStatus> = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function mapClient(client: AdminClient): AdminClientRow {
  return {
    id: String(client.id),
    name: client.name,
    company: client.company ?? "—",
    document: client.cpfCnpj ?? "—",
    unit: client.unit?.name ?? "—",
    status: statusMap[client.status] ?? "active",
    registrationDate: formatDate(client.createdAt),
    email: client.email,
  };
}

class LoadAdminClients {
  static async loadAdminClients(input: LoadAdminClientsInput): Promise<AdminClientsLoadResult> {
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

      const response = await AdminClientsApi.fetchAdminClients(params);

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
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminClients.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  LoadAdminClients,
  type LoadAdminClientsInput,
  type AdminClientsLoadResult,
  type AdminClientRow,
};
