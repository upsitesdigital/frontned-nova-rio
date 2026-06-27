import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { Messages } from "@/lib/core/messages";

interface EmployeeOption {
  id: number;
  name: string;
}

interface GetActiveEmployeeOptionsResult {
  data: EmployeeOption[] | null;
  error: string | null;
}

class GetActiveEmployeeOptions {
  static async getActiveEmployeeOptions(): Promise<GetActiveEmployeeOptionsResult> {
    try {
      const employees = await AdminAppointmentsApi.fetchEmployees();
      const activeOptions = employees
        .filter((e) => e.status === "ACTIVE")
        .map((e) => ({ id: e.id, name: e.name }));
      return { data: activeOptions, error: null };
    } catch {
      return { data: null, error: Messages.adminAppointments.employeesError };
    }
  }
}

export { GetActiveEmployeeOptions, type EmployeeOption };
