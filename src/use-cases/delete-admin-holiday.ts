import { deleteAdminHoliday as deleteAdminHolidayApi } from "@/api/admin-holidays-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface DeleteAdminHolidayResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function deleteAdminHoliday(id: number): Promise<DeleteAdminHolidayResult> {
  try {
    await deleteAdminHolidayApi(id);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminHolidays.deleteError),
      isAuthError: isAuthError(error),
    };
  }
}

export { deleteAdminHoliday, type DeleteAdminHolidayResult };
