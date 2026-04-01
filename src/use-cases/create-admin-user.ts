import {
  createAdminUser as createAdminUserApi,
  type AdminUser,
  type CreateAdminUserPayload,
} from "@/api/admin-users-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface CreateAdminUserResult {
  data: AdminUser | null;
  error: string | null;
  isAuthError: boolean;
}

async function createAdminUser(payload: CreateAdminUserPayload): Promise<CreateAdminUserResult> {
  try {
    const data = await createAdminUserApi(payload);
    return { data, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminUsers.createError),
      isAuthError: isAuthError(error),
    };
  }
}

export { createAdminUser, type CreateAdminUserResult };