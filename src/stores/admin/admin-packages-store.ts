import { create } from "zustand";

import type { AdminPackage } from "@/api/admin/admin-packages-api";
import type { AdminServiceOption } from "@/use-cases/admin-services/get-admin-service-options";
import { Messages } from "@/lib/core/messages";
import { useToastStore } from "@/stores/ui/toast-store";
import { CreateAdminPackage } from "@/use-cases/admin-packages/create-admin-package";
import { DeactivateAdminPackage } from "@/use-cases/admin-packages/deactivate-admin-package";
import { GetAdminServiceOptions } from "@/use-cases/admin-services/get-admin-service-options";
import { LoadAdminPackages } from "@/use-cases/admin-packages/load-admin-packages";
import { ReactivateAdminPackage } from "@/use-cases/admin-packages/reactivate-admin-package";
import { UpdateAdminPackage } from "@/use-cases/admin-packages/update-admin-package";

type PackageStatusFilter = "all" | "active";

interface AdminPackageFormData {
  name: string;
  description: string;
  totalHoursInput: string;
  priceInput: string;
  serviceId: string;
}

interface AdminPackagesState {
  packages: AdminPackage[];
  totalPackages: number;
  currentPage: number;
  pageSize: number;
  statusFilter: PackageStatusFilter;
  serviceFilter: string;
  serviceOptions: AdminServiceOption[];
  isLoading: boolean;
  isSaving: boolean;
  togglingPackageId: number | null;
  error: string | null;
  isAuthError: boolean;
  isEditorOpen: boolean;
  editingPackageId: number | null;
  isMounted: boolean;
  form: AdminPackageFormData;
}

interface AdminPackagesActions {
  loadPackages: (page?: number) => Promise<void>;
  loadServiceOptions: () => Promise<void>;
  setMounted: (mounted: boolean) => void;
  setCurrentPage: (page: number) => void;
  setStatusFilter: (filter: PackageStatusFilter) => void;
  setServiceFilter: (serviceId: string) => void;
  openCreateEditor: () => void;
  openEditEditor: (packageId: number) => void;
  closeEditor: () => void;
  updateFormField: <K extends keyof AdminPackageFormData>(
    field: K,
    value: AdminPackageFormData[K],
  ) => void;
  savePackage: () => Promise<boolean>;
  togglePackageStatus: (packageId: number, nextActive: boolean) => Promise<boolean>;
  reset: () => void;
}

type AdminPackagesStore = AdminPackagesState & AdminPackagesActions;

const defaultPageSize = 10;

const defaultForm: AdminPackageFormData = {
  name: "",
  description: "",
  totalHoursInput: "",
  priceInput: "",
  serviceId: "",
};

const initialState: AdminPackagesState = {
  packages: [],
  totalPackages: 0,
  currentPage: 1,
  pageSize: defaultPageSize,
  statusFilter: "all",
  serviceFilter: "all",
  serviceOptions: [],
  isLoading: false,
  isSaving: false,
  togglingPackageId: null,
  error: null,
  isAuthError: false,
  isEditorOpen: false,
  editingPackageId: null,
  isMounted: false,
  form: defaultForm,
};

let listAbortController: AbortController | null = null;
let listLoadRequestId = 0;

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function toInteger(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) return null;
  return parsed;
}

function formatPriceInput(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

const useAdminPackagesStore = create<AdminPackagesStore>()((set, get) => ({
  ...initialState,

  loadPackages: async (page) => {
    listAbortController?.abort();
    listAbortController = new AbortController();
    const requestId = ++listLoadRequestId;
    const signal = listAbortController.signal;

    const targetPage = page ?? get().currentPage;
    const statusFilter = get().statusFilter;
    const serviceFilter = get().serviceFilter;

    set({ isLoading: true, error: null, isAuthError: false });

    const result = await LoadAdminPackages.loadAdminPackages(
      {
        page: targetPage,
        limit: get().pageSize,
        active: statusFilter === "active" ? true : undefined,
        serviceId: serviceFilter !== "all" ? Number(serviceFilter) : undefined,
      },
      signal,
    );

    if (signal.aborted || requestId !== listLoadRequestId) {
      return;
    }

    if (result.data) {
      set({
        packages: result.data.items,
        totalPackages: result.data.total,
        currentPage: result.data.page,
        isLoading: false,
      });
      return;
    }

    set({
      isLoading: false,
      error: result.error,
      isAuthError: result.isAuthError,
    });
  },

  loadServiceOptions: async () => {
    const result = await GetAdminServiceOptions.getAdminServiceOptions();
    if (!result.data || result.error) {
      useToastStore
        .getState()
        .showToast(result.error ?? Messages.adminPackages.serviceOptionsError, "error");
      return;
    }

    set({ serviceOptions: result.data });
  },

  setMounted: (mounted) => {
    set({ isMounted: mounted });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
    void get().loadPackages(page);
  },

  setStatusFilter: (filter) => {
    set({ statusFilter: filter, currentPage: 1 });
    void get().loadPackages(1);
  },

  setServiceFilter: (serviceId) => {
    set({ serviceFilter: serviceId, currentPage: 1 });
    void get().loadPackages(1);
  },

  openCreateEditor: () => {
    set({
      isEditorOpen: true,
      editingPackageId: null,
      form: { ...defaultForm },
    });
  },

  openEditEditor: (packageId) => {
    const selectedPackage = get().packages.find((item) => item.id === packageId);
    if (!selectedPackage) return;

    set({
      isEditorOpen: true,
      editingPackageId: selectedPackage.id,
      form: {
        name: selectedPackage.name,
        description: selectedPackage.description ?? "",
        totalHoursInput: selectedPackage.totalHours ? String(selectedPackage.totalHours) : "",
        priceInput: formatPriceInput(selectedPackage.price),
        serviceId: String(selectedPackage.serviceId),
      },
    });
  },

  closeEditor: () => {
    set({
      isEditorOpen: false,
      editingPackageId: null,
      form: { ...defaultForm },
    });
  },

  updateFormField: (field, value) => {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },

  savePackage: async () => {
    const { form, editingPackageId } = get();

    if (!form.name.trim()) {
      useToastStore.getState().showToast(Messages.adminPackages.requiredName, "error");
      return false;
    }

    const price = toNumber(form.priceInput);
    if (price === null || price <= 0) {
      useToastStore.getState().showToast(Messages.adminPackages.invalidPrice, "error");
      return false;
    }

    if (!form.serviceId) {
      useToastStore.getState().showToast(Messages.adminPackages.requiredService, "error");
      return false;
    }

    const totalHours = toInteger(form.totalHoursInput);
    if (form.totalHoursInput.trim() && (totalHours === null || totalHours <= 0)) {
      useToastStore.getState().showToast(Messages.adminPackages.invalidTotalHours, "error");
      return false;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      totalHours: totalHours ?? undefined,
      price,
      serviceId: Number(form.serviceId),
    };

    set({ isSaving: true, isAuthError: false });

    if (editingPackageId) {
      const result = await UpdateAdminPackage.updateAdminPackage(editingPackageId, payload);

      if (!result.data || result.error) {
        useToastStore
          .getState()
          .showToast(result.error ?? Messages.adminPackages.updateError, "error");
        set({ isSaving: false, isAuthError: result.isAuthError });
        return false;
      }

      await get().loadPackages();
      useToastStore.getState().showToast(Messages.adminPackages.updateSuccess, "success");
      set({ isSaving: false });
      get().closeEditor();
      return true;
    }

    const result = await CreateAdminPackage.createAdminPackage(payload);

    if (!result.data || result.error) {
      useToastStore
        .getState()
        .showToast(result.error ?? Messages.adminPackages.createError, "error");
      set({ isSaving: false, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadPackages(1);
    useToastStore.getState().showToast(Messages.adminPackages.createSuccess, "success");
    set({ isSaving: false });
    get().closeEditor();
    return true;
  },

  togglePackageStatus: async (packageId, nextActive) => {
    set({ togglingPackageId: packageId, isAuthError: false });

    const result = nextActive
      ? await ReactivateAdminPackage.reactivateAdminPackage(packageId)
      : await DeactivateAdminPackage.deactivateAdminPackage(packageId);

    if (!result.success) {
      useToastStore
        .getState()
        .showToast(
          result.error ??
            (nextActive
              ? Messages.adminPackages.reactivateError
              : Messages.adminPackages.deactivateError),
          "error",
        );
      set({ togglingPackageId: null, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadPackages();
    useToastStore
      .getState()
      .showToast(
        nextActive
          ? Messages.adminPackages.reactivateSuccess
          : Messages.adminPackages.deactivateSuccess,
        "success",
      );
    set({ togglingPackageId: null });
    return true;
  },

  reset: () => {
    listAbortController?.abort();
    listAbortController = null;
    set(initialState);
  },
}));

export {
  useAdminPackagesStore,
  type AdminPackagesStore,
  type AdminPackageFormData,
  type PackageStatusFilter,
};
