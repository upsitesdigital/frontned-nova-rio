import { AdminDashboardApi, type AgendaItem } from "@/api/admin/admin-dashboard-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface AgendaLoadResult {
  items: AgendaItem[];
  total: number;
  error: null;
  isAuthError: false;
}

interface AgendaLoadError {
  items: null;
  total: null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminAgenda {
  static async loadTodayAgenda(
    page: number,
    pageSize: number,
    serviceId?: number,
    signal?: AbortSignal,
  ): Promise<AgendaLoadResult | AgendaLoadError> {
    try {
      const agenda = await AdminDashboardApi.fetchTodayAgenda(page, pageSize, serviceId, signal);
      return {
        items: agenda.items,
        total: agenda.total,
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      if (signal?.aborted) {
        return { items: null, total: null, error: null, isAuthError: false };
      }
      return {
        items: null,
        total: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.agenda.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminAgenda, type AgendaLoadResult, type AgendaLoadError };
