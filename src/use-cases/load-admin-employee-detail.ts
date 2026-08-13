import {
  fetchAdminEmployeeById,
  type AdminEmployee,
} from "@/api/admin-employees-api";
import { fetchUnits, type RawUnit } from "@/api/admin-appointments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface AdminEmployeeDetailResult {
  data: { employee: AdminEmployee; units: RawUnit[] } | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminEmployeeDetail(
  id: number,
): Promise<AdminEmployeeDetailResult> {
  try {
    const [employee, units] = await Promise.all([
      fetchAdminEmployeeById(id),
      fetchUnits().catch(() => [] as RawUnit[]),
    ]);

    return {
      data: { employee, units },
      error: null,
      isAuthError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminEmployees.loadDetailError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminEmployeeDetail, type AdminEmployeeDetailResult };
