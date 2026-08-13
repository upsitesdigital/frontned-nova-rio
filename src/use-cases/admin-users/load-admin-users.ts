import {
  AdminUsersApi,
  type AdminUser,
  type ListAdminUsersParams,
} from "@/api/admin/admin-users-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

type AdminUsersFilter = "all" | "active";

const maxAdminUsersLimit = 100;

interface LoadAdminUsersInput {
  filter: AdminUsersFilter;
  search?: string;
  signal?: AbortSignal;
}

interface LoadAdminUsersResult {
  data: { users: AdminUser[]; total: number } | null;
  error: string | null;
  isAuthError: boolean;
}

function mapFilterToStatus(filter: AdminUsersFilter): ListAdminUsersParams["status"] {
  if (filter === "active") return "ACTIVE";
  return undefined;
}

class LoadAdminUsers {
  static async loadAdminUsers(input: LoadAdminUsersInput): Promise<LoadAdminUsersResult> {
    try {
      const response = await AdminUsersApi.fetchAdminUsers(
        {
          page: 1,
          limit: maxAdminUsersLimit,
          status: mapFilterToStatus(input.filter),
          search: input.search?.trim() || undefined,
        },
        input.signal,
      );

      return {
        data: {
          users: response.data,
          total: response.total,
        },
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      if (input.signal?.aborted) {
        return { data: null, error: null, isAuthError: false };
      }

      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUsers.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  LoadAdminUsers,
  maxAdminUsersLimit,
  type LoadAdminUsersInput,
  type LoadAdminUsersResult,
  type AdminUsersFilter,
};
