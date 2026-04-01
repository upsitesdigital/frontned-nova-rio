import {
  createAdminHoliday as createAdminHolidayApi,
  type AdminHoliday,
  type SaveAdminHolidayPayload,
} from "@/api/admin-holidays-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface CreateAdminHolidayResult {
  data: AdminHoliday | null;
  error: string | null;
  isAuthError: boolean;
}

async function createAdminHoliday(payload: SaveAdminHolidayPayload): Promise<CreateAdminHolidayResult> {
  try {
    const data = await createAdminHolidayApi(payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminHolidays.createError),
      isAuthError: isAuthError(error),
    };
  }
}

export { createAdminHoliday, type CreateAdminHolidayResult };
