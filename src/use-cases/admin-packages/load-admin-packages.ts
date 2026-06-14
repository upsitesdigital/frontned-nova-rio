import { AdminPackagesApi, type AdminPackage } from "@/api/admin/admin-packages-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface LoadAdminPackagesParams {
  page: number;
  limit: number;
  active?: boolean;
  serviceId?: number;
}

interface LoadAdminPackagesResult {
  data: { items: AdminPackage[]; total: number; page: number; limit: number } | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminPackages {
  static async loadAdminPackages(
    params: LoadAdminPackagesParams,
    signal?: AbortSignal,
  ): Promise<LoadAdminPackagesResult> {
    try {
      const response = await AdminPackagesApi.fetchAdminPackages(params, signal);

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
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminPackages.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminPackages, type LoadAdminPackagesResult, type LoadAdminPackagesParams };
