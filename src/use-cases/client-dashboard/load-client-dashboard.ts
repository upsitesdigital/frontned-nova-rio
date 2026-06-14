import {
  DashboardApi,
  type ClientDashboardSummary,
} from "@/api/client/dashboard-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface ClientDashboardResult {
  data: ClientDashboardSummary | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadClientDashboard {
  static async loadClientDashboard(): Promise<ClientDashboardResult> {
    try {
      const data = await DashboardApi.fetchClientDashboardSummary();
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.dashboard.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadClientDashboard, type ClientDashboardResult };
