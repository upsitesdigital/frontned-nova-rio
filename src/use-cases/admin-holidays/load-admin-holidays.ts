import { AdminHolidaysApi, type AdminHoliday } from "@/api/admin/admin-holidays-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface LoadAdminHolidaysResult {
  data: AdminHoliday[] | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminHolidays {
  static async loadAdminHolidays(
    year?: number,
    signal?: AbortSignal,
  ): Promise<LoadAdminHolidaysResult> {
    try {
      const data = await AdminHolidaysApi.fetchAdminHolidays(year, signal);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      if (signal?.aborted) {
        return { data: null, error: null, isAuthError: false };
      }

      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminHolidays.loadError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { LoadAdminHolidays, type LoadAdminHolidaysResult };
