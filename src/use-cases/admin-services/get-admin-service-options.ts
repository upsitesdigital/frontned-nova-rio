import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { Messages } from "@/lib/core/messages";

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

class GetAdminServiceOptions {
  static async getAdminServiceOptions(): Promise<GetAdminServiceOptionsResult> {
    try {
      const services = await AdminAppointmentsApi.fetchAdminServices();
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
      return { data: null, error: Messages.adminAppointments.servicesError };
    }
  }
}

export { GetAdminServiceOptions, type AdminServiceOption };
