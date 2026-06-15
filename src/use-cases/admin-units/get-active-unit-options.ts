import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { Messages } from "@/lib/core/messages";

interface UnitOption {
  id: number;
  name: string;
}

interface GetActiveUnitOptionsResult {
  data: UnitOption[] | null;
  error: string | null;
}

class GetActiveUnitOptions {
  static async getActiveUnitOptions(): Promise<GetActiveUnitOptionsResult> {
    try {
      const units = await AdminAppointmentsApi.fetchUnits();
      const activeOptions = units
        .filter((u) => u.isActive)
        .map((u) => ({ id: u.id, name: u.name }));
      return { data: activeOptions, error: null };
    } catch {
      return { data: null, error: Messages.adminAppointments.unitsError };
    }
  }
}

export { GetActiveUnitOptions, type UnitOption };
