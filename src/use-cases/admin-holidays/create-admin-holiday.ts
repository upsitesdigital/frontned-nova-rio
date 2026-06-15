import {
  AdminHolidaysApi,
  type AdminHoliday,
  type SaveAdminHolidayPayload,
} from "@/api/admin/admin-holidays-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface CreateAdminHolidayResult {
  data: AdminHoliday | null;
  error: string | null;
  isAuthError: boolean;
}

class CreateAdminHoliday {
  static async createAdminHoliday(
    payload: SaveAdminHolidayPayload,
  ): Promise<CreateAdminHolidayResult> {
    try {
      const data = await AdminHolidaysApi.createAdminHoliday(payload);
      return { data, error: null, isAuthError: false };
    } catch (error) {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminHolidays.createError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { CreateAdminHoliday, type CreateAdminHolidayResult };
