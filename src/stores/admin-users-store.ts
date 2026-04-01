import { create } from "zustand";

import type { AdminUser, AdminUserRole } from "@/api/admin-users-api";
import type { DsUserFormPopupValues, DsUserTableFilter } from "@/design-system";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { createAdminUser } from "@/use-cases/create-admin-user";
import { deactivateAdminUser } from "@/use-cases/deactivate-admin-user";
import { loadAdminUserDetail } from "@/use-cases/load-admin-user-detail";
import { loadAdminUsers } from "@/use-cases/load-admin-users";

interface AdminUsersState {
  users: AdminUser[];
  totalUsers: number;
  isLoading: boolean;
  isSaving: boolean;
  isLoadingDetail: boolean;
  deactivatingUserId: number | null;
  error: string | null;
  detailError: string | null;
  isAuthError: boolean;
  filter: DsUserTableFilter;
  searchQuery: string;
  isCreateModalOpen: boolean;
  isDetailModalOpen: boolean;
  isPasswordVisible: boolean;
  selectedUser: AdminUser | null;
  selectedDeleteUser: AdminUser | null;
  form: DsUserFormPopupValues;
}

interface AdminUsersActions {
  loadUsers: () => Promise<void>;
  setFilter: (filter: DsUserTableFilter) => void;
  setSearchQuery: (query: string) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setPasswordVisible: (visible: boolean) => void;
  updateFormField: <K extends keyof DsUserFormPopupValues>(
    field: K,
    value: DsUserFormPopupValues[K],
  ) => void;
  createUser: () => Promise<boolean>;
  openUserDetails: (userId: number) => Promise<void>;
  closeUserDetails: () => void;
  openDeleteConfirm: (userId: number) => void;
  closeDeleteConfirm: () => void;
  deactivateSelectedUser: () => Promise<boolean>;
  reset: () => void;
}

type AdminUsersStore = AdminUsersState & AdminUsersActions;

const DEFAULT_FORM: DsUserFormPopupValues = {
  name: "",
  email: "",
  password: "",
  role: "admin_basic",
  active: "active",
};

const initialState: AdminUsersState = {
  users: [],
  totalUsers: 0,
  isLoading: false,
  isSaving: false,
  isLoadingDetail: false,
  deactivatingUserId: null,
  error: null,
  detailError: null,
  isAuthError: false,
  filter: "all",
  searchQuery: "",
  isCreateModalOpen: false,
  isDetailModalOpen: false,
  isPasswordVisible: false,
  selectedUser: null,
  selectedDeleteUser: null,
  form: DEFAULT_FORM,
};

let listAbortController: AbortController | null = null;

function isValidEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value);
}

function mapFormRoleToApiRole(role: string): AdminUserRole {
  return role === "admin_master" ? "ADMIN_MASTER" : "ADMIN_BASIC";
}

const useAdminUsersStore = create<AdminUsersStore>()((set, get) => ({
  ...initialState,

  loadUsers: async () => {
    listAbortController?.abort();
    listAbortController = new AbortController();

    const { filter, searchQuery } = get();

    set({ isLoading: true, error: null, isAuthError: false });

    const result = await loadAdminUsers({
      filter,
      search: searchQuery,
      signal: listAbortController.signal,
    });

    if (result.data) {
      set({
        users: result.data.users,
        totalUsers: result.data.total,
        isLoading: false,
      });
      return;
    }

    if (result.error) {
      set({
        isLoading: false,
        error: result.error,
        isAuthError: result.isAuthError,
      });
      return;
    }

    set({ isLoading: false });
  },

  setFilter: (filter) => {
    set({ filter });
    void get().loadUsers();
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    void get().loadUsers();
  },

  openCreateModal: () => {
    set({
      isCreateModalOpen: true,
      isPasswordVisible: false,
      form: { ...DEFAULT_FORM },
    });
  },

  closeCreateModal: () => {
    set({
      isCreateModalOpen: false,
      isPasswordVisible: false,
      form: { ...DEFAULT_FORM },
    });
  },

  setPasswordVisible: (visible) => {
    set({ isPasswordVisible: visible });
  },

  updateFormField: (field, value) => {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },

  createUser: async () => {
    const { form } = get();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name) {
      useToastStore.getState().showToast(MESSAGES.adminUsers.requiredName, "error");
      return false;
    }

    if (!email) {
      useToastStore.getState().showToast(MESSAGES.adminUsers.requiredEmail, "error");
      return false;
    }

    if (!isValidEmail(email)) {
      useToastStore.getState().showToast(MESSAGES.adminUsers.invalidEmail, "error");
      return false;
    }

    if (!password) {
      useToastStore.getState().showToast(MESSAGES.adminUsers.requiredPassword, "error");
      return false;
    }

    set({ isSaving: true, isAuthError: false });

    const createResult = await createAdminUser({
      name,
      email,
      password,
      role: mapFormRoleToApiRole(form.role),
    });

    if (!createResult.data || createResult.error) {
      useToastStore
        .getState()
        .showToast(createResult.error ?? MESSAGES.adminUsers.createError, "error");
      set({ isSaving: false, isAuthError: createResult.isAuthError });
      return false;
    }

    if (form.active === "inactive") {
      const deactivateResult = await deactivateAdminUser(createResult.data.id);

      if (!deactivateResult.success) {
        useToastStore.getState().showToast(
          deactivateResult.error ?? MESSAGES.adminUsers.deactivateError,
          "warning",
        );
      }
    }

    await get().loadUsers();
    set({ isSaving: false });
    get().closeCreateModal();
    return true;
  },

  openUserDetails: async (userId) => {
    set({
      isDetailModalOpen: true,
      isLoadingDetail: true,
      detailError: null,
      selectedUser: null,
      isAuthError: false,
    });

    const result = await loadAdminUserDetail(userId);

    if (result.data) {
      set({ isLoadingDetail: false, selectedUser: result.data });
      return;
    }

    set({
      isLoadingDetail: false,
      detailError: result.error,
      isAuthError: result.isAuthError,
    });
  },

  closeUserDetails: () => {
    set({
      isDetailModalOpen: false,
      isLoadingDetail: false,
      detailError: null,
      selectedUser: null,
    });
  },

  openDeleteConfirm: (userId) => {
    const user = get().users.find((item) => item.id === userId) ?? null;
    set({ selectedDeleteUser: user });
  },

  closeDeleteConfirm: () => {
    set({ selectedDeleteUser: null, deactivatingUserId: null });
  },

  deactivateSelectedUser: async () => {
    const { selectedDeleteUser } = get();
    if (!selectedDeleteUser) return false;

    set({ deactivatingUserId: selectedDeleteUser.id, isAuthError: false });

    const result = await deactivateAdminUser(selectedDeleteUser.id);

    if (!result.success) {
      useToastStore
        .getState()
        .showToast(result.error ?? MESSAGES.adminUsers.deactivateError, "error");
      set({
        deactivatingUserId: null,
        isAuthError: result.isAuthError,
      });
      return false;
    }

    await get().loadUsers();
    set({ deactivatingUserId: null, selectedDeleteUser: null });
    return true;
  },

  reset: () => {
    listAbortController?.abort();
    listAbortController = null;
    set(initialState);
  },
}));

export {
  useAdminUsersStore,
  type AdminUsersStore,
};