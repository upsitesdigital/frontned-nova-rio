import { create } from "zustand";

import type { AdminHoliday } from "@/api/admin-holidays-api";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { createAdminHoliday } from "@/use-cases/create-admin-holiday";
import { deleteAdminHoliday } from "@/use-cases/delete-admin-holiday";
import { loadAdminHolidays } from "@/use-cases/load-admin-holidays";
import { syncAdminHolidays } from "@/use-cases/sync-admin-holidays";
import { updateAdminHoliday } from "@/use-cases/update-admin-holiday";

interface AdminHolidayFormData {
  date: string;
  name: string;
  isBlocked: boolean;
}

interface AdminHolidaysState {
  holidays: AdminHoliday[];
  yearFilter: string;
  isLoading: boolean;
  isSaving: boolean;
  isSyncing: boolean;
  deletingHolidayId: number | null;
  error: string | null;
  isAuthError: boolean;
  isEditorOpen: boolean;
  editingHolidayId: number | null;
  form: AdminHolidayFormData;
}

interface AdminHolidaysActions {
  loadHolidays: (year?: number) => Promise<void>;
  setYearFilter: (year: string) => void;
  openCreateEditor: () => void;
  openEditEditor: (holidayId: number) => void;
  closeEditor: () => void;
  updateFormField: <K extends keyof AdminHolidayFormData>(
    field: K,
    value: AdminHolidayFormData[K],
  ) => void;
  saveHoliday: () => Promise<boolean>;
  removeHoliday: (holidayId: number) => Promise<boolean>;
  syncHolidaysByYear: () => Promise<boolean>;
  reset: () => void;
}

type AdminHolidaysStore = AdminHolidaysState & AdminHolidaysActions;

const DEFAULT_FORM: AdminHolidayFormData = {
  date: "",
  name: "",
  isBlocked: true,
};

const currentYear = new Date().getFullYear();

const initialState: AdminHolidaysState = {
  holidays: [],
  yearFilter: String(currentYear),
  isLoading: false,
  isSaving: false,
  isSyncing: false,
  deletingHolidayId: null,
  error: null,
  isAuthError: false,
  isEditorOpen: false,
  editingHolidayId: null,
  form: DEFAULT_FORM,
};

let listAbortController: AbortController | null = null;

function toDateInputValue(value: string): string {
  return value.slice(0, 10);
}

const useAdminHolidaysStore = create<AdminHolidaysStore>()((set, get) => ({
  ...initialState,

  loadHolidays: async (year) => {
    listAbortController?.abort();
    listAbortController = new AbortController();

    const targetYear = year ?? Number(get().yearFilter);

    set({ isLoading: true, error: null, isAuthError: false });

    const result = await loadAdminHolidays(targetYear, listAbortController.signal);

    if (result.data) {
      set({ holidays: result.data, isLoading: false });
      return;
    }

    set({
      isLoading: false,
      error: result.error,
      isAuthError: result.isAuthError,
    });
  },

  setYearFilter: (year) => {
    set({ yearFilter: year });

    const parsedYear = Number(year);
    if (Number.isInteger(parsedYear) && parsedYear >= 2020 && parsedYear <= 2100) {
      void get().loadHolidays(parsedYear);
    }
  },

  openCreateEditor: () => {
    set({
      isEditorOpen: true,
      editingHolidayId: null,
      form: { ...DEFAULT_FORM },
    });
  },

  openEditEditor: (holidayId) => {
    const holiday = get().holidays.find((item) => item.id === holidayId);
    if (!holiday) return;

    set({
      isEditorOpen: true,
      editingHolidayId: holiday.id,
      form: {
        date: toDateInputValue(holiday.date),
        name: holiday.name,
        isBlocked: holiday.isBlocked,
      },
    });
  },

  closeEditor: () => {
    set({
      isEditorOpen: false,
      editingHolidayId: null,
      form: { ...DEFAULT_FORM },
    });
  },

  updateFormField: (field, value) => {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },

  saveHoliday: async () => {
    const { form, editingHolidayId } = get();

    if (!form.date) {
      useToastStore.getState().showToast(MESSAGES.adminHolidays.requiredDate, "error");
      return false;
    }

    if (!form.name.trim()) {
      useToastStore.getState().showToast(MESSAGES.adminHolidays.requiredName, "error");
      return false;
    }

    const payload = {
      date: form.date,
      name: form.name.trim(),
      isBlocked: form.isBlocked,
    };

    set({ isSaving: true, isAuthError: false });

    if (editingHolidayId) {
      const result = await updateAdminHoliday(editingHolidayId, payload);

      if (!result.data || result.error) {
        useToastStore
          .getState()
          .showToast(result.error ?? MESSAGES.adminHolidays.updateError, "error");
        set({ isSaving: false, isAuthError: result.isAuthError });
        return false;
      }

      await get().loadHolidays();
      useToastStore.getState().showToast(MESSAGES.adminHolidays.updateSuccess, "success");
      set({ isSaving: false });
      get().closeEditor();
      return true;
    }

    const result = await createAdminHoliday(payload);

    if (!result.data || result.error) {
      useToastStore
        .getState()
        .showToast(result.error ?? MESSAGES.adminHolidays.createError, "error");
      set({ isSaving: false, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadHolidays();
    useToastStore.getState().showToast(MESSAGES.adminHolidays.createSuccess, "success");
    set({ isSaving: false });
    get().closeEditor();
    return true;
  },

  removeHoliday: async (holidayId) => {
    set({ deletingHolidayId: holidayId, isAuthError: false });

    const result = await deleteAdminHoliday(holidayId);

    if (!result.success) {
      useToastStore
        .getState()
        .showToast(result.error ?? MESSAGES.adminHolidays.deleteError, "error");
      set({ deletingHolidayId: null, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadHolidays();
    useToastStore.getState().showToast(MESSAGES.adminHolidays.deleteSuccess, "success");
    set({ deletingHolidayId: null });
    return true;
  },

  syncHolidaysByYear: async () => {
    const year = Number(get().yearFilter);

    if (!Number.isInteger(year) || year < 2020 || year > 2100) {
      useToastStore.getState().showToast(MESSAGES.adminHolidays.invalidYear, "error");
      return false;
    }

    set({ isSyncing: true, isAuthError: false });

    const result = await syncAdminHolidays(year);

    if (!result.data || result.error) {
      useToastStore.getState().showToast(result.error ?? MESSAGES.adminHolidays.syncError, "error");
      set({ isSyncing: false, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadHolidays(year);
    useToastStore
      .getState()
      .showToast(MESSAGES.adminHolidays.syncSuccess(result.data.synced), "success");
    set({ isSyncing: false });
    return true;
  },

  reset: () => {
    listAbortController?.abort();
    listAbortController = null;
    set(initialState);
  },
}));

export { useAdminHolidaysStore, type AdminHolidaysStore, type AdminHolidayFormData };
