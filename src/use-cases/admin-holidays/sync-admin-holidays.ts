import { AdminHolidaysApi } from "@/api/admin/admin-holidays-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface SyncAdminHolidaysResult {
  data: { synced: number } | null;
  error: string | null;
  isAuthError: boolean;
}

class SyncAdminHolidays {
  static async syncAdminHolidays(year: number): Promise<SyncAdminHolidaysResult> {
    try {
      const response = await AdminHolidaysApi.syncAdminHolidays({ year });
      return {
        data: { synced: response.synced },
        error: null,
        isAuthError: false,
      };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminHolidays.syncError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { SyncAdminHolidays, type SyncAdminHolidaysResult };
