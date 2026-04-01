import { reactivateAdminPackage as reactivateAdminPackageApi } from "@/api/admin-packages-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface ReactivateAdminPackageResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function reactivateAdminPackage(id: number): Promise<ReactivateAdminPackageResult> {
  try {
    await reactivateAdminPackageApi(id);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminPackages.reactivateError),
      isAuthError: isAuthError(error),
    };
  }
}

export { reactivateAdminPackage, type ReactivateAdminPackageResult };
