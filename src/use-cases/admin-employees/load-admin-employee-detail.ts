import { AdminEmployeesApi, type AdminEmployee } from "@/api/admin/admin-employees-api";
import { AdminAppointmentsApi, type RawUnit } from "@/api/admin/admin-appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface AdminEmployeeDetailResult {
  data: { employee: AdminEmployee; units: RawUnit[] } | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminEmployeeDetail {
  static async loadAdminEmployeeDetail(id: number): Promise<AdminEmployeeDetailResult> {
    try {
      const [employee, units] = await Promise.all([
        AdminEmployeesApi.fetchAdminEmployeeById(id),
        AdminAppointmentsApi.fetchUnits().catch(() => [] as RawUnit[]),
      ]);

      return {
        data: { employee, units },
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminEmployees.loadDetailError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminEmployeeDetail, type AdminEmployeeDetailResult };
