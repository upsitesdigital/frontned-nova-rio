import {
  fetchAdminUsers,
  type AdminUser,
  type ListAdminUsersParams,
} from "@/api/admin-users-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";
import type { DsUserTableFilter } from "@/design-system";

const MAX_ADMIN_USERS_LIMIT = 100;

interface LoadAdminUsersInput {
  filter: DsUserTableFilter;
  search?: string;
  signal?: AbortSignal;
}

interface LoadAdminUsersResult {
  data: { users: AdminUser[]; total: number } | null;
  error: string | null;
  isAuthError: boolean;
}

function mapFilterToStatus(filter: DsUserTableFilter): ListAdminUsersParams["status"] {
  if (filter === "active") return "ACTIVE";
  return undefined;
}

async function loadAdminUsers(input: LoadAdminUsersInput): Promise<LoadAdminUsersResult> {
  try {
    const response = await fetchAdminUsers(
      {
        page: 1,
        limit: MAX_ADMIN_USERS_LIMIT,
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
      error: resolveErrorMessage(error, MESSAGES.adminUsers.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminUsers, MAX_ADMIN_USERS_LIMIT, type LoadAdminUsersInput, type LoadAdminUsersResult };