import { syncAdminHolidays as syncAdminHolidaysApi } from "@/api/admin-holidays-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface SyncAdminHolidaysResult {
  data: { synced: number } | null;
  error: string | null;
  isAuthError: boolean;
}

async function syncAdminHolidays(year: number): Promise<SyncAdminHolidaysResult> {
  try {
    const response = await syncAdminHolidaysApi({ year });
    return {
      data: { synced: response.synced },
      error: null,
      isAuthError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminHolidays.syncError),
      isAuthError: isAuthError(error),
    };
  }
}

export { syncAdminHolidays, type SyncAdminHolidaysResult };
