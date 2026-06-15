import {
  AdminHolidaysApi,
  type AdminHoliday,
  type SaveAdminHolidayPayload,
} from "@/api/admin/admin-holidays-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface UpdateAdminHolidayResult {
  data: AdminHoliday | null;
  error: string | null;
  isAuthError: boolean;
}

class UpdateAdminHoliday {
  static async updateAdminHoliday(
    id: number,
    payload: Partial<SaveAdminHolidayPayload>,
  ): Promise<UpdateAdminHolidayResult> {
    try {
      const data = await AdminHolidaysApi.updateAdminHoliday(id, payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminHolidays.updateError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { UpdateAdminHoliday, type UpdateAdminHolidayResult };
