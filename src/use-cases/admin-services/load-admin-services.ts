import { AdminServicesApi, type AdminService } from "@/api/admin/admin-services-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

const maxServicesLimit = 100;

interface LoadAdminServicesResult {
  data: AdminService[] | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminServices {
  static async loadAdminServices(signal?: AbortSignal): Promise<LoadAdminServicesResult> {
    try {
      const response = await AdminServicesApi.fetchAdminServices(
        {
          page: 1,
          limit: maxServicesLimit,
        },
        signal,
      );

      return { data: response.data, error: null, isAuthError: false };
    } catch (error) {
      if (signal?.aborted) {
        return { data: null, error: null, isAuthError: false };
      }

      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminServices.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminServices, maxServicesLimit, type LoadAdminServicesResult };
