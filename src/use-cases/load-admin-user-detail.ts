import { fetchAdminUserById, type AdminUser } from "@/api/admin-users-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface LoadAdminUserDetailResult {
  data: AdminUser | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminUserDetail(userId: number): Promise<LoadAdminUserDetailResult> {
  try {
    const data = await fetchAdminUserById(userId);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminUsers.detailError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminUserDetail, type LoadAdminUserDetailResult };