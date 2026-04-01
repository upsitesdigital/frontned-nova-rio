import { create } from "zustand";

import type { AdminUnit } from "@/api/admin-units-api";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { createAdminUnit } from "@/use-cases/create-admin-unit";
import { deleteAdminUnit } from "@/use-cases/delete-admin-unit";
import { loadAdminUnits } from "@/use-cases/load-admin-units";
import { updateAdminUnit } from "@/use-cases/update-admin-unit";

interface AdminUnitFormData {
  name: string;
  address: string;
  latitudeInput: string;
  longitudeInput: string;
  serviceRadiusKmInput: string;
}

interface AdminUnitsState {
  units: AdminUnit[];
  totalUnits: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  isSaving: boolean;
  deletingUnitId: number | null;
  error: string | null;
  isAuthError: boolean;
  isEditorOpen: boolean;
  editingUnitId: number | null;
  form: AdminUnitFormData;
}

interface AdminUnitsActions {
  loadUnits: (page?: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
  openCreateEditor: () => void;
  openEditEditor: (unitId: number) => void;
  closeEditor: () => void;
  updateFormField: <K extends keyof AdminUnitFormData>(field: K, value: AdminUnitFormData[K]) => void;
  saveUnit: () => Promise<boolean>;
  removeUnit: (unitId: number) => Promise<boolean>;
  reset: () => void;
}

type AdminUnitsStore = AdminUnitsState & AdminUnitsActions;

const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_FORM: AdminUnitFormData = {
  name: "",
  address: "",
  latitudeInput: "",
  longitudeInput: "",
  serviceRadiusKmInput: "5",
};

const initialState: AdminUnitsState = {
  units: [],
  totalUnits: 0,
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  isLoading: false,
  isSaving: false,
  deletingUnitId: null,
  error: null,
  isAuthError: false,
  isEditorOpen: false,
  editingUnitId: null,
  form: DEFAULT_FORM,
};

let listAbortController: AbortController | null = null;

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function formatNumber(value: number | null): string {
  if (value === null) return "";
  return String(value);
}

const useAdminUnitsStore = create<AdminUnitsStore>()((set, get) => ({
  ...initialState,

  loadUnits: async (page) => {
    listAbortController?.abort();
    listAbortController = new AbortController();

    const targetPage = page ?? get().currentPage;

    set({ isLoading: true, error: null, isAuthError: false });

    const result = await loadAdminUnits(
      { page: targetPage, limit: get().pageSize },
      listAbortController.signal,
    );

    if (result.data) {
      set({
        units: result.data.items,
        totalUnits: result.data.total,
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

  setCurrentPage: (page) => {
    set({ currentPage: page });
    void get().loadUnits(page);
  },

  openCreateEditor: () => {
    set({
      isEditorOpen: true,
      editingUnitId: null,
      form: { ...DEFAULT_FORM },
    });
  },

  openEditEditor: (unitId) => {
    const unit = get().units.find((item) => item.id === unitId);
    if (!unit) return;

    set({
      isEditorOpen: true,
      editingUnitId: unit.id,
      form: {
        name: unit.name,
        address: unit.address ?? "",
        latitudeInput: formatNumber(unit.latitude),
        longitudeInput: formatNumber(unit.longitude),
        serviceRadiusKmInput: String(unit.serviceRadiusKm),
      },
    });
  },

  closeEditor: () => {
    set({
      isEditorOpen: false,
      editingUnitId: null,
      form: { ...DEFAULT_FORM },
    });
  },

  updateFormField: (field, value) => {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },

  saveUnit: async () => {
    const { form, editingUnitId } = get();

    const name = form.name.trim();
    if (!name) {
      useToastStore.getState().showToast(MESSAGES.adminUnits.requiredName, "error");
      return false;
    }

    const latitude = toNumber(form.latitudeInput);
    const longitude = toNumber(form.longitudeInput);
    const radius = toNumber(form.serviceRadiusKmInput);

    if (form.latitudeInput.trim() && latitude === null) {
      useToastStore.getState().showToast(MESSAGES.adminUnits.invalidLatitude, "error");
      return false;
    }

    if (form.longitudeInput.trim() && longitude === null) {
      useToastStore.getState().showToast(MESSAGES.adminUnits.invalidLongitude, "error");
      return false;
    }

    if (form.serviceRadiusKmInput.trim() && (radius === null || radius <= 0)) {
      useToastStore.getState().showToast(MESSAGES.adminUnits.invalidRadius, "error");
      return false;
    }

    const payload = {
      name,
      address: form.address.trim() || undefined,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
      serviceRadiusKm: radius ?? undefined,
    };

    set({ isSaving: true, isAuthError: false });

    if (editingUnitId) {
      const result = await updateAdminUnit(editingUnitId, payload);

      if (!result.data || result.error) {
        useToastStore
          .getState()
          .showToast(result.error ?? MESSAGES.adminUnits.updateError, "error");
        set({ isSaving: false, isAuthError: result.isAuthError });
        return false;
      }

      await get().loadUnits();
      useToastStore.getState().showToast(MESSAGES.adminUnits.updateSuccess, "success");
      set({ isSaving: false });
      get().closeEditor();
      return true;
    }

    const result = await createAdminUnit(payload);

    if (!result.data || result.error) {
      useToastStore.getState().showToast(result.error ?? MESSAGES.adminUnits.createError, "error");
      set({ isSaving: false, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadUnits(1);
    useToastStore.getState().showToast(MESSAGES.adminUnits.createSuccess, "success");
    set({ isSaving: false });
    get().closeEditor();
    return true;
  },

  removeUnit: async (unitId) => {
    set({ deletingUnitId: unitId, isAuthError: false });

    const result = await deleteAdminUnit(unitId);

    if (!result.success) {
      useToastStore
        .getState()
        .showToast(result.error ?? MESSAGES.adminUnits.deleteError, "error");
      set({ deletingUnitId: null, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadUnits();
    useToastStore.getState().showToast(MESSAGES.adminUnits.deleteSuccess, "success");
    set({ deletingUnitId: null });
    return true;
  },

  reset: () => {
    listAbortController?.abort();
    listAbortController = null;
    set(initialState);
  },
}));

export { useAdminUnitsStore, type AdminUnitsStore, type AdminUnitFormData };
