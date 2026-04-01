import {
  updateAdminHoliday as updateAdminHolidayApi,
  type AdminHoliday,
  type SaveAdminHolidayPayload,
} from "@/api/admin-holidays-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface UpdateAdminHolidayResult {
  data: AdminHoliday | null;
  error: string | null;
  isAuthError: boolean;
}

async function updateAdminHoliday(
  id: number,
  payload: Partial<SaveAdminHolidayPayload>,
): Promise<UpdateAdminHolidayResult> {
  try {
    const data = await updateAdminHolidayApi(id, payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminHolidays.updateError),
      isAuthError: isAuthError(error),
    };
  }
}

export { updateAdminHoliday, type UpdateAdminHolidayResult };
