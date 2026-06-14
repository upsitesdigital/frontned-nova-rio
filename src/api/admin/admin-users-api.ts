import { HttpClient } from "@/api/core/http-client";

type AdminUserRole = "ADMIN_MASTER" | "ADMIN_BASIC";
type AdminUserStatus = "ACTIVE" | "INACTIVE";

interface AdminUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
  updatedAt: string;
  createdById: number | null;
}

interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

interface ListAdminUsersParams {
  page: number;
  limit: number;
  status?: AdminUserStatus;
  search?: string;
}

interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  role?: AdminUserRole;
}

class AdminUsersApi {
  static async fetchAdminUsers(
    params: ListAdminUsersParams,
    signal?: AbortSignal,
  ): Promise<AdminUsersResponse> {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });

    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);

    return HttpClient.authGet<AdminUsersResponse>(
      `/admin-users?${searchParams.toString()}`,
      signal,
    );
  }

  static async fetchAdminUserById(id: number): Promise<AdminUser> {
    return HttpClient.authGet<AdminUser>(`/admin-users/${id}`);
  }

  static async createAdminUser(payload: CreateAdminUserPayload): Promise<AdminUser> {
    return HttpClient.authPost<AdminUser>("/admin-users", payload);
  }

  static async deactivateAdminUser(id: number): Promise<void> {
    await HttpClient.authDelete<void>(`/admin-users/${id}`);
  }
}

export {
  AdminUsersApi,
  type AdminUser,
  type AdminUsersResponse,
  type ListAdminUsersParams,
  type CreateAdminUserPayload,
  type AdminUserRole,
  type AdminUserStatus,
};
