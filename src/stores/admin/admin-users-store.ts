import { create } from "zustand";

import type { AdminUser, AdminUserRole } from "@/api/admin/admin-users-api";
import type { DsUserFormPopupValues, DsUserTableFilter } from "@/design-system";
import { Messages } from "@/lib/core/messages";
import { useToastStore } from "@/stores/ui/toast-store";
import { CreateAdminUser } from "@/use-cases/admin-users/create-admin-user";
import { DeactivateAdminUser } from "@/use-cases/admin-users/deactivate-admin-user";
import { LoadAdminUserDetail } from "@/use-cases/admin-users/load-admin-user-detail";
import { LoadAdminUsers } from "@/use-cases/admin-users/load-admin-users";

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
  showCreatedAlert: boolean;
  selectedUser: AdminUser | null;
  selectedDeleteUser: AdminUser | null;
  form: DsUserFormPopupValues;
}

interface AdminUsersActions {
  loadUsers: () => Promise<void>;
  setFilter: (filter: DsUserTableFilter) => void;
  setShowCreatedAlert: (visible: boolean) => void;
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

const defaultForm: DsUserFormPopupValues = {
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
  showCreatedAlert: false,
  selectedUser: null,
  selectedDeleteUser: null,
  form: defaultForm,
};

let listAbortController: AbortController | null = null;
let listRequestId = 0;
let detailRequestId = 0;

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
    const requestId = ++listRequestId;
    const signal = listAbortController.signal;

    const { filter, searchQuery } = get();

    set({ isLoading: true, error: null, isAuthError: false });

    const result = await LoadAdminUsers.loadAdminUsers({
      filter,
      search: searchQuery,
      signal,
    });

    if (signal.aborted || requestId !== listRequestId) {
      return;
    }

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

  setShowCreatedAlert: (visible) => {
    set({ showCreatedAlert: visible });
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    void get().loadUsers();
  },

  openCreateModal: () => {
    set({
      isCreateModalOpen: true,
      isPasswordVisible: false,
      form: { ...defaultForm },
    });
  },

  closeCreateModal: () => {
    set({
      isCreateModalOpen: false,
      isPasswordVisible: false,
      form: { ...defaultForm },
    });
  },

  setPasswordVisible: (visible) => {
    set({ isPasswordVisible: visible });
  },

  updateFormField: (field, value) => {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },

  createUser: async () => {
    const { form, isSaving } = get();
    if (isSaving) return false;
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name) {
      useToastStore.getState().showToast(Messages.adminUsers.requiredName, "error");
      return false;
    }

    if (!email) {
      useToastStore.getState().showToast(Messages.adminUsers.requiredEmail, "error");
      return false;
    }

    if (!isValidEmail(email)) {
      useToastStore.getState().showToast(Messages.adminUsers.invalidEmail, "error");
      return false;
    }

    if (!password) {
      useToastStore.getState().showToast(Messages.adminUsers.requiredPassword, "error");
      return false;
    }

    set({ isSaving: true, isAuthError: false });

    const createResult = await CreateAdminUser.createAdminUser({
      name,
      email,
      password,
      role: mapFormRoleToApiRole(form.role),
    });

    if (!createResult.data || createResult.error) {
      useToastStore
        .getState()
        .showToast(createResult.error ?? Messages.adminUsers.createError, "error");
      set({ isSaving: false, isAuthError: createResult.isAuthError });
      return false;
    }

    if (form.active === "inactive") {
      const deactivateResult = await DeactivateAdminUser.deactivateAdminUser(createResult.data.id);

      if (!deactivateResult.success) {
        useToastStore
          .getState()
          .showToast(deactivateResult.error ?? Messages.adminUsers.deactivateError, "warning");
      }
    }

    await get().loadUsers();
    set({ isSaving: false, showCreatedAlert: true });
    get().closeCreateModal();
    return true;
  },

  openUserDetails: async (userId) => {
    const requestId = ++detailRequestId;

    set({
      isDetailModalOpen: true,
      isLoadingDetail: true,
      detailError: null,
      selectedUser: null,
      isAuthError: false,
    });

    const result = await LoadAdminUserDetail.loadAdminUserDetail(userId);

    if (requestId !== detailRequestId) {
      return;
    }

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
    const { selectedDeleteUser, deactivatingUserId } = get();
    if (!selectedDeleteUser || deactivatingUserId === selectedDeleteUser.id) return false;

    set({ deactivatingUserId: selectedDeleteUser.id, isAuthError: false });

    const result = await DeactivateAdminUser.deactivateAdminUser(selectedDeleteUser.id);

    if (!result.success) {
      useToastStore
        .getState()
        .showToast(result.error ?? Messages.adminUsers.deactivateError, "error");
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
    listRequestId++;
    detailRequestId++;
    listAbortController = null;
    set(initialState);
  },
}));

export { useAdminUsersStore, type AdminUsersStore };
