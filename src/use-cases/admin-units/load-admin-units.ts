import { AdminUnitsApi, type AdminUnit } from "@/api/admin/admin-units-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface LoadAdminUnitsParams {
  page: number;
  limit: number;
}

interface LoadAdminUnitsResult {
  data: { items: AdminUnit[]; total: number; page: number; limit: number } | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminUnits {
  static async loadAdminUnits(
    params: LoadAdminUnitsParams,
    signal?: AbortSignal,
  ): Promise<LoadAdminUnitsResult> {
    try {
      const response = await AdminUnitsApi.fetchAdminUnits(params, signal);

      return {
        data: {
          items: response.data,
          total: response.total,
          page: response.page,
          limit: response.limit,
        },
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      if (signal?.aborted) {
        return { data: null, error: null, isAuthError: false };
      }

      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminUnits.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminUnits, type LoadAdminUnitsResult, type LoadAdminUnitsParams };
