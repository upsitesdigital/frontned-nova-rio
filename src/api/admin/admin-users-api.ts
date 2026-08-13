import { HttpClient } from "@/api/core/http-client";

export type AdminUserRole = "ADMIN_MASTER" | "ADMIN_BASIC";
export type AdminUserStatus = "ACTIVE" | "INACTIVE";

export interface AdminUser {
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

export interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface ListAdminUsersParams {
  page: number;
  limit: number;
  status?: AdminUserStatus;
  search?: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  role?: AdminUserRole;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: AdminUserRole;
  status?: AdminUserStatus;
}

export class AdminUsersApi {
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

  static async updateAdminUser(id: number, payload: UpdateAdminUserPayload): Promise<AdminUser> {
    return HttpClient.authPatchWithBody<AdminUser>(`/admin-users/${id}`, payload);
  }

  static async deactivateAdminUser(id: number): Promise<void> {
    await HttpClient.authDelete<void>(`/admin-users/${id}`);
  }
}
