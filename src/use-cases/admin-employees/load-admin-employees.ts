import {
  AdminEmployeesApi,
  type AdminEmployee,
  type ListAdminEmployeesParams,
} from "@/api/admin/admin-employees-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

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

class LoadAdminEmployees {
  static async loadAdminEmployees(
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

      const response = await AdminEmployeesApi.fetchAdminEmployees(params);

      return {
        data: { employees: response.data, total: response.total },
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminEmployees.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminEmployees, type LoadAdminEmployeesInput, type AdminEmployeesLoadResult };
