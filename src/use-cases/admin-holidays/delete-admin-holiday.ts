import { AdminHolidaysApi } from "@/api/admin/admin-holidays-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface DeleteAdminHolidayResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class DeleteAdminHoliday {
  static async deleteAdminHoliday(id: number): Promise<DeleteAdminHolidayResult> {
    try {
      await AdminHolidaysApi.deleteAdminHoliday(id);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminHolidays.deleteError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { DeleteAdminHoliday, type DeleteAdminHolidayResult };
