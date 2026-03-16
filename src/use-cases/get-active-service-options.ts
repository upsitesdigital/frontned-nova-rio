import { fetchAdminDashboardServices } from "@/api/admin-dashboard-api";
import { MESSAGES } from "@/lib/messages";

interface ActiveServiceOption {
  id: number;
  name: string;
}

interface ActiveServiceOptionsResult {
  data: ActiveServiceOption[] | null;
  error: string | null;
}

async function getActiveServiceOptions(): Promise<ActiveServiceOptionsResult> {
  try {
    const rawServices = await fetchAdminDashboardServices();
    const options = rawServices.filter((s) => s.isActive).map((s) => ({ id: s.id, name: s.name }));
    return { data: options, error: null };
  } catch {
    return { data: null, error: MESSAGES.adminAppointments.optionsError };
  }
}

export { getActiveServiceOptions, type ActiveServiceOption, type ActiveServiceOptionsResult };
