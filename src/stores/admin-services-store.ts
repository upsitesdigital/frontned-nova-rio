import { create } from "zustand";

import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { loadAdminServices } from "@/use-cases/load-admin-services";
import { createAdminService } from "@/use-cases/create-admin-service";
import { updateAdminService } from "@/use-cases/update-admin-service";
import { deleteAdminService } from "@/use-cases/delete-admin-service";
import type { AdminService, SaveAdminServicePayload } from "@/api/admin-services-api";

type ServiceFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";
type PaymentOption = "single" | "package" | "recurrence";
type SaveServiceResult = "created" | "updated" | null;

interface AdminServiceFormData {
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
  form: AdminServiceFormData;
}

interface AdminServicesActions {
  loadServices: () => Promise<void>;
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

type AdminServicesStore = AdminServicesState & AdminServicesActions;

const ICON_OPTIONS = ["broom", "sketch-logo", "star-four"] as const;

const DEFAULT_FORM: AdminServiceFormData = {
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
  form: DEFAULT_FORM,
};

let listAbortController: AbortController | null = null;

function formatBasePriceInput(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

function parseBasePriceInput(value: string): number | null {
  const cleaned = value.trim().replace(/[^\d.,]/g, "");
  const sanitized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;

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
    useToastStore.getState().showToast(MESSAGES.adminServices.requiredName, "error");
    return null;
  }

  if (!form.description.trim()) {
    useToastStore.getState().showToast(MESSAGES.adminServices.requiredDescription, "error");
    return null;
  }

  if (basePrice === null) {
    useToastStore.getState().showToast(MESSAGES.adminServices.invalidPrice, "error");
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
  };
}

const useAdminServicesStore = create<AdminServicesStore>()((set, get) => ({
  ...initialState,

  loadServices: async () => {
    listAbortController?.abort();
    listAbortController = new AbortController();

    set({ isLoading: true, error: null, isAuthError: false });

    const result = await loadAdminServices(listAbortController.signal);

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

  openCreateEditor: () => {
    set({
      isEditorOpen: true,
      editingServiceId: null,
      form: { ...DEFAULT_FORM },
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
        recurrenceFrequencies: service.allowRecurrence ? ["WEEKLY", "MONTHLY"] : [],
      },
    });
  },

  closeEditor: () => {
    set({
      isEditorOpen: false,
      editingServiceId: null,
      form: { ...DEFAULT_FORM },
    });
  },

  updateFormField: (field, value) => {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },

  cycleFormIcon: () => {
    const currentIcon = get().form.icon;
    const currentIndex = ICON_OPTIONS.indexOf(currentIcon as (typeof ICON_OPTIONS)[number]);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % ICON_OPTIONS.length;

    set((state) => ({
      form: {
        ...state.form,
        icon: ICON_OPTIONS[nextIndex],
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
      const result = await updateAdminService(editingServiceId, payload);

      if (!result.data || result.error) {
        useToastStore
          .getState()
          .showToast(result.error ?? MESSAGES.adminServices.updateError, "error");
        set({ isSaving: false, isAuthError: result.isAuthError });
        return null;
      }

      await get().loadServices();
      useToastStore.getState().showToast(MESSAGES.adminServices.updateSuccess, "success");
      set({ isSaving: false });
      get().closeEditor();
      return "updated";
    }

    const result = await createAdminService(payload);

    if (!result.data || result.error) {
      useToastStore
        .getState()
        .showToast(result.error ?? MESSAGES.adminServices.createError, "error");
      set({ isSaving: false, isAuthError: result.isAuthError });
      return null;
    }

    await get().loadServices();
    set({ isSaving: false });
    get().closeEditor();
    return "created";
  },

  removeService: async (serviceId) => {
    set({ deletingServiceId: serviceId, isAuthError: false });

    const result = await deleteAdminService(serviceId);

    if (!result.success) {
      useToastStore
        .getState()
        .showToast(result.error ?? MESSAGES.adminServices.deleteError, "error");
      set({ deletingServiceId: null, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadServices();
    useToastStore.getState().showToast(MESSAGES.adminServices.deleteSuccess, "success");
    set({ deletingServiceId: null });
    return true;
  },

  reset: () => {
    listAbortController?.abort();
    listAbortController = null;
    set(initialState);
  },
}));

export {
  useAdminServicesStore,
  type AdminServicesStore,
  type AdminServiceFormData,
  type ServiceFrequency,
  type PaymentOption,
  type SaveServiceResult,
};
