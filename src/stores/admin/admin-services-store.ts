import { create } from "zustand";

import { Messages } from "@/lib/core/messages";
import { useToastStore } from "@/stores/ui/toast-store";
import { LoadAdminServices } from "@/use-cases/admin-services/load-admin-services";
import { CreateAdminService } from "@/use-cases/admin-services/create-admin-service";
import { UpdateAdminService } from "@/use-cases/admin-services/update-admin-service";
import { DeleteAdminService } from "@/use-cases/admin-services/delete-admin-service";
import type { AdminService, SaveAdminServicePayload } from "@/api/admin/admin-services-api";

export type ServiceFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";
export type PaymentOption = "single" | "package" | "recurrence";
export type SaveServiceResult = "created" | "updated" | null;

export interface AdminServiceFormData {
  name: string;
  description: string;
  basePriceInput: string;
  icon: string;
  allowSingle: boolean;
  allowPackage: boolean;
  allowRecurrence: boolean;
  recurrenceFrequencies: ServiceFrequency[];
}

interface AdminServicesState {
  services: AdminService[];
  isLoading: boolean;
  isSaving: boolean;
  deletingServiceId: number | null;
  error: string | null;
  isAuthError: boolean;
  isEditorOpen: boolean;
  editingServiceId: number | null;
  showCreatedAlert: boolean;
  pendingDeleteServiceId: number | null;
  form: AdminServiceFormData;
}

interface AdminServicesActions {
  loadServices: () => Promise<void>;
  setShowCreatedAlert: (visible: boolean) => void;
  setPendingDeleteServiceId: (serviceId: number | null) => void;
  openCreateEditor: () => void;
  openEditEditor: (serviceId: number) => void;
  closeEditor: () => void;
  updateFormField: <K extends keyof AdminServiceFormData>(
    field: K,
    value: AdminServiceFormData[K],
  ) => void;
  cycleFormIcon: () => void;
  togglePaymentOption: (option: PaymentOption, enabled: boolean) => void;
  toggleRecurrenceFrequency: (frequency: ServiceFrequency, selected: boolean) => void;
  saveService: () => Promise<SaveServiceResult>;
  removeService: (serviceId: number) => Promise<boolean>;
  reset: () => void;
}

export type AdminServicesStore = AdminServicesState & AdminServicesActions;

const iconOptions = ["broom", "sketch-logo", "star-four"] as const;

const defaultForm: AdminServiceFormData = {
  name: "",
  description: "",
  basePriceInput: "50,00",
  icon: "broom",
  allowSingle: true,
  allowPackage: false,
  allowRecurrence: true,
  recurrenceFrequencies: ["WEEKLY", "MONTHLY"],
};

const initialState: AdminServicesState = {
  services: [],
  isLoading: false,
  isSaving: false,
  deletingServiceId: null,
  error: null,
  isAuthError: false,
  isEditorOpen: false,
  editingServiceId: null,
  showCreatedAlert: false,
  pendingDeleteServiceId: null,
  form: defaultForm,
};

let listAbortController: AbortController | null = null;
let listLoadRequestId = 0;

function formatBasePriceInput(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

function parseBasePriceInput(value: string): number | null {
  const cleaned = value.trim().replace(/[^\d.,]/g, "");
  const sanitized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;

  if (!sanitized) return null;

  const parsed = Number(sanitized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function toSavePayload(form: AdminServiceFormData): SaveAdminServicePayload | null {
  const basePrice = parseBasePriceInput(form.basePriceInput);

  if (!form.name.trim()) {
    useToastStore.getState().showToast(Messages.adminServices.requiredName, "error");
    return null;
  }

  if (!form.description.trim()) {
    useToastStore.getState().showToast(Messages.adminServices.requiredDescription, "error");
    return null;
  }

  if (basePrice === null) {
    useToastStore.getState().showToast(Messages.adminServices.invalidPrice, "error");
    return null;
  }

  return {
    name: form.name.trim(),
    description: form.description.trim(),
    icon: form.icon,
    basePrice,
    allowSingle: form.allowSingle,
    allowPackage: form.allowPackage,
    allowRecurrence: form.allowRecurrence,
    recurrenceFrequencies: form.allowRecurrence ? form.recurrenceFrequencies : [],
  };
}

export const useAdminServicesStore = create<AdminServicesStore>()((set, get) => ({
  ...initialState,

  loadServices: async () => {
    listAbortController?.abort();
    listAbortController = new AbortController();
    const requestId = ++listLoadRequestId;
    const signal = listAbortController.signal;

    set({ isLoading: true, error: null, isAuthError: false });

    const result = await LoadAdminServices.loadAdminServices(signal);

    if (signal.aborted || requestId !== listLoadRequestId) {
      return;
    }

    if (result.data) {
      set({ services: result.data, isLoading: false });
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

  setShowCreatedAlert: (visible) => {
    set({ showCreatedAlert: visible });
  },

  setPendingDeleteServiceId: (serviceId) => {
    set({ pendingDeleteServiceId: serviceId });
  },

  openCreateEditor: () => {
    set({
      isEditorOpen: true,
      editingServiceId: null,
      form: { ...defaultForm },
    });
  },

  openEditEditor: (serviceId) => {
    const service = get().services.find((item) => item.id === serviceId);
    if (!service) return;

    set({
      isEditorOpen: true,
      editingServiceId: service.id,
      form: {
        name: service.name,
        description: service.description ?? "",
        basePriceInput: formatBasePriceInput(service.basePrice),
        icon: service.icon ?? "broom",
        allowSingle: service.allowSingle,
        allowPackage: service.allowPackage,
        allowRecurrence: service.allowRecurrence,
        recurrenceFrequencies: service.recurrenceFrequencies,
      },
    });
  },

  closeEditor: () => {
    set({
      isEditorOpen: false,
      editingServiceId: null,
      form: { ...defaultForm },
    });
  },

  updateFormField: (field, value) => {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },

  cycleFormIcon: () => {
    const currentIcon = get().form.icon;
    const currentIndex = iconOptions.indexOf(currentIcon as (typeof iconOptions)[number]);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % iconOptions.length;

    set((state) => ({
      form: {
        ...state.form,
        icon: iconOptions[nextIndex],
      },
    }));
  },

  togglePaymentOption: (option, enabled) => {
    set((state) => {
      if (option === "single") {
        return { form: { ...state.form, allowSingle: enabled } };
      }

      if (option === "package") {
        return { form: { ...state.form, allowPackage: enabled } };
      }

      return {
        form: {
          ...state.form,
          allowRecurrence: enabled,
          recurrenceFrequencies: enabled
            ? state.form.recurrenceFrequencies.length > 0
              ? state.form.recurrenceFrequencies
              : ["WEEKLY", "MONTHLY"]
            : [],
        },
      };
    });
  },

  toggleRecurrenceFrequency: (frequency, selected) => {
    set((state) => {
      if (!state.form.allowRecurrence) return state;

      const current = state.form.recurrenceFrequencies;
      const next = selected
        ? Array.from(new Set([...current, frequency]))
        : current.filter((value) => value !== frequency);

      return {
        form: {
          ...state.form,
          recurrenceFrequencies: next,
        },
      };
    });
  },

  saveService: async () => {
    const { form, editingServiceId } = get();
    const payload = toSavePayload(form);

    if (!payload) return null;

    set({ isSaving: true, isAuthError: false });

    if (editingServiceId) {
      const result = await UpdateAdminService.updateAdminService(editingServiceId, payload);

      if (!result.data || result.error) {
        useToastStore
          .getState()
          .showToast(result.error ?? Messages.adminServices.updateError, "error");
        set({ isSaving: false, isAuthError: result.isAuthError });
        return null;
      }

      await get().loadServices();
      useToastStore.getState().showToast(Messages.adminServices.updateSuccess, "success");
      set({ isSaving: false });
      get().closeEditor();
      return "updated";
    }

    const result = await CreateAdminService.createAdminService(payload);

    if (!result.data || result.error) {
      useToastStore
        .getState()
        .showToast(result.error ?? Messages.adminServices.createError, "error");
      set({ isSaving: false, isAuthError: result.isAuthError });
      return null;
    }

    await get().loadServices();
    set({ isSaving: false, showCreatedAlert: true });
    get().closeEditor();
    return "created";
  },

  removeService: async (serviceId) => {
    set({ deletingServiceId: serviceId, isAuthError: false });

    const result = await DeleteAdminService.deleteAdminService(serviceId);

    if (!result.success) {
      useToastStore
        .getState()
        .showToast(result.error ?? Messages.adminServices.deleteError, "error");
      set({ deletingServiceId: null, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadServices();
    useToastStore.getState().showToast(Messages.adminServices.deleteSuccess, "success");
    set({ deletingServiceId: null });
    return true;
  },

  reset: () => {
    listAbortController?.abort();
    listAbortController = null;
    set(initialState);
  },
}));
