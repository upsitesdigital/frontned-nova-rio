import { fetchAdminPackages, type AdminPackage } from "@/api/admin-packages-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

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

async function loadAdminPackages(
  params: LoadAdminPackagesParams,
  signal?: AbortSignal,
): Promise<LoadAdminPackagesResult> {
  try {
    const response = await fetchAdminPackages(params, signal);

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
      error: resolveErrorMessage(error, MESSAGES.adminPackages.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminPackages, type LoadAdminPackagesResult, type LoadAdminPackagesParams };
