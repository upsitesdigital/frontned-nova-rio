import { httpAuthDelete, httpAuthGet, httpAuthPost } from "./http-client";

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

async function fetchAdminUsers(
  params: ListAdminUsersParams,
  signal?: AbortSignal,
): Promise<AdminUsersResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  return httpAuthGet<AdminUsersResponse>(`/admin-users?${searchParams.toString()}`, signal);
}

async function fetchAdminUserById(id: number): Promise<AdminUser> {
  return httpAuthGet<AdminUser>(`/admin-users/${id}`);
}

async function createAdminUser(payload: CreateAdminUserPayload): Promise<AdminUser> {
  return httpAuthPost<AdminUser>("/admin-users", payload);
}

async function deactivateAdminUser(id: number): Promise<void> {
  await httpAuthDelete<void>(`/admin-users/${id}`);
}

export {
  fetchAdminUsers,
  fetchAdminUserById,
  createAdminUser,
  deactivateAdminUser,
  type AdminUser,
  type AdminUsersResponse,
  type ListAdminUsersParams,
  type CreateAdminUserPayload,
  type AdminUserRole,
  type AdminUserStatus,
};