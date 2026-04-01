import { fetchAdminServices, type AdminService } from "@/api/admin-services-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

const MAX_SERVICES_LIMIT = 100;

interface LoadAdminServicesResult {
  data: AdminService[] | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminServices(signal?: AbortSignal): Promise<LoadAdminServicesResult> {
  try {
    const response = await fetchAdminServices({
      page: 1,
      limit: MAX_SERVICES_LIMIT,
    }, signal);

    return { data: response.data, error: null, isAuthError: false };
  } catch (error) {
    if (signal?.aborted) {
      return { data: null, error: null, isAuthError: false };
    }

    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminServices.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminServices, MAX_SERVICES_LIMIT, type LoadAdminServicesResult };
