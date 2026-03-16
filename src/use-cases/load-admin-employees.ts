import {
  fetchAdminEmployees,
  type AdminEmployee,
  type ListAdminEmployeesParams,
} from "@/api/admin-employees-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface LoadAdminEmployeesInput {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

interface AdminEmployeesLoadResult {
  data: { employees: AdminEmployee[]; total: number } | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminEmployees(
  input: LoadAdminEmployeesInput,
): Promise<AdminEmployeesLoadResult> {
  try {
    const params: ListAdminEmployeesParams = {
      page: input.page,
      limit: input.limit,
    };
    if (input.status && input.status !== "all") {
      params.status = input.status as "ACTIVE" | "INACTIVE";
    }
    if (input.search) {
      params.search = input.search;
    }

    const response = await fetchAdminEmployees(params);

    return {
      data: { employees: response.data, total: response.total },
      error: null,
      isAuthError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminEmployees.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminEmployees, type LoadAdminEmployeesInput, type AdminEmployeesLoadResult };
