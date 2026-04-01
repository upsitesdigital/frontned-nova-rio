import { fetchAdminHolidays, type AdminHoliday } from "@/api/admin-holidays-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface LoadAdminHolidaysResult {
  data: AdminHoliday[] | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminHolidays(year?: number, signal?: AbortSignal): Promise<LoadAdminHolidaysResult> {
  try {
    const data = await fetchAdminHolidays(year, signal);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    if (signal?.aborted) {
      return { data: null, error: null, isAuthError: false };
    }

    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminHolidays.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminHolidays, type LoadAdminHolidaysResult };
