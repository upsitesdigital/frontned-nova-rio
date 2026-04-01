import { fetchAdminUnits, type AdminUnit } from "@/api/admin-units-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface LoadAdminUnitsParams {
  page: number;
  limit: number;
}

interface LoadAdminUnitsResult {
  data: { items: AdminUnit[]; total: number; page: number; limit: number } | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminUnits(
  params: LoadAdminUnitsParams,
  signal?: AbortSignal,
): Promise<LoadAdminUnitsResult> {
  try {
    const response = await fetchAdminUnits(params, signal);

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
      error: resolveErrorMessage(error, MESSAGES.adminUnits.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminUnits, type LoadAdminUnitsResult, type LoadAdminUnitsParams };
