import { fetchAdminServices } from "@/api/admin-appointments-api";
import { MESSAGES } from "@/lib/messages";

interface AdminServiceOption {
  id: number;
  name: string;
  allowSingle: boolean;
  allowPackage: boolean;
  allowRecurrence: boolean;
}

interface GetAdminServiceOptionsResult {
  data: AdminServiceOption[] | null;
  error: string | null;
}

async function getAdminServiceOptions(): Promise<GetAdminServiceOptionsResult> {
  try {
    const services = await fetchAdminServices();
    const activeOptions = services
      .filter((s) => s.isActive)
      .map((s) => ({
        id: s.id,
        name: s.name,
        allowSingle: s.allowSingle,
        allowPackage: s.allowPackage,
        allowRecurrence: s.allowRecurrence,
      }));
    return { data: activeOptions, error: null };
  } catch {
    return { data: null, error: MESSAGES.adminAppointments.servicesError };
  }
}

export { getAdminServiceOptions, type AdminServiceOption };
