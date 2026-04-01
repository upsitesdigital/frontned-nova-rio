import { deactivateAdminPackage as deactivateAdminPackageApi } from "@/api/admin-packages-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface DeactivateAdminPackageResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function deactivateAdminPackage(id: number): Promise<DeactivateAdminPackageResult> {
  try {
    await deactivateAdminPackageApi(id);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminPackages.deactivateError),
      isAuthError: isAuthError(error),
    };
  }
}

export { deactivateAdminPackage, type DeactivateAdminPackageResult };
