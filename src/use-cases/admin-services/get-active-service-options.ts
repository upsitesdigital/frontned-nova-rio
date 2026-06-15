import { AdminDashboardApi } from "@/api/admin/admin-dashboard-api";
import { Messages } from "@/lib/core/messages";

interface ActiveServiceOption {
  id: number;
  name: string;
}

interface ActiveServiceOptionsResult {
  data: ActiveServiceOption[] | null;
  error: string | null;
}

class GetActiveServiceOptions {
  static async getActiveServiceOptions(): Promise<ActiveServiceOptionsResult> {
    try {
      const rawServices = await AdminDashboardApi.fetchAdminDashboardServices();
      const options = rawServices
        .filter((s) => s.isActive)
        .map((s) => ({ id: s.id, name: s.name }));
      return { data: options, error: null };
    } catch {
      return { data: null, error: Messages.adminAppointments.optionsError };
    }
  }
}

export { GetActiveServiceOptions, type ActiveServiceOption, type ActiveServiceOptionsResult };
