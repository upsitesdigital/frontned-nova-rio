import { AdminReportsApi, type AdminActiveClientsByUnit } from "@/api/admin/admin-reports-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface LoadAdminActiveClientsInput {
  unitId?: number;
  signal?: AbortSignal;
}

interface AdminActiveClientsData {
  totalActive: number;
  byUnit: AdminActiveClientsByUnit[];
}

interface LoadAdminActiveClientsResult {
  data: AdminActiveClientsData | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminActiveClients {
  static async loadAdminActiveClients(
    input: LoadAdminActiveClientsInput,
  ): Promise<LoadAdminActiveClientsResult> {
    try {
      const response = await AdminReportsApi.fetchAdminActiveClients(
        { unitId: input.unitId },
        input.signal,
      );

      return {
        data: {
          totalActive: response.totalActive,
          byUnit: response.byUnit,
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
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminReports.activeClientsLoadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  LoadAdminActiveClients,
  type LoadAdminActiveClientsInput,
  type AdminActiveClientsData,
  type LoadAdminActiveClientsResult,
};
