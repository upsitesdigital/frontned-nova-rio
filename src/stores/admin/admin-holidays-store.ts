import { create } from "zustand";

import type { AdminHoliday } from "@/api/admin/admin-holidays-api";
import { Messages } from "@/lib/core/messages";
import { useToastStore } from "@/stores/ui/toast-store";
import { CreateAdminHoliday } from "@/use-cases/admin-holidays/create-admin-holiday";
import { DeleteAdminHoliday } from "@/use-cases/admin-holidays/delete-admin-holiday";
import { LoadAdminHolidays } from "@/use-cases/admin-holidays/load-admin-holidays";
import { SyncAdminHolidays } from "@/use-cases/admin-holidays/sync-admin-holidays";
import { UpdateAdminHoliday } from "@/use-cases/admin-holidays/update-admin-holiday";

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
  pendingDeleteHolidayId: number | null;
  form: AdminHolidayFormData;
}

interface AdminHolidaysActions {
  loadHolidays: (year?: number) => Promise<void>;
  setYearFilter: (year: string) => void;
  setPendingDeleteHolidayId: (holidayId: number | null) => void;
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

const defaultForm: AdminHolidayFormData = {
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
  pendingDeleteHolidayId: null,
  form: defaultForm,
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

    const result = await LoadAdminHolidays.loadAdminHolidays(
      targetYear,
      listAbortController.signal,
    );

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

  setPendingDeleteHolidayId: (holidayId) => {
    set({ pendingDeleteHolidayId: holidayId });
  },

  openCreateEditor: () => {
    set({
      isEditorOpen: true,
      editingHolidayId: null,
      form: { ...defaultForm },
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
      form: { ...defaultForm },
    });
  },

  updateFormField: (field, value) => {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },

  saveHoliday: async () => {
    const { form, editingHolidayId } = get();

    if (!form.date) {
      useToastStore.getState().showToast(Messages.adminHolidays.requiredDate, "error");
      return false;
    }

    if (!form.name.trim()) {
      useToastStore.getState().showToast(Messages.adminHolidays.requiredName, "error");
      return false;
    }

    const payload = {
      date: form.date,
      name: form.name.trim(),
      isBlocked: form.isBlocked,
    };

    set({ isSaving: true, isAuthError: false });

    if (editingHolidayId) {
      const result = await UpdateAdminHoliday.updateAdminHoliday(editingHolidayId, payload);

      if (!result.data || result.error) {
        useToastStore
          .getState()
          .showToast(result.error ?? Messages.adminHolidays.updateError, "error");
        set({ isSaving: false, isAuthError: result.isAuthError });
        return false;
      }

      await get().loadHolidays();
      useToastStore.getState().showToast(Messages.adminHolidays.updateSuccess, "success");
      set({ isSaving: false });
      get().closeEditor();
      return true;
    }

    const result = await CreateAdminHoliday.createAdminHoliday(payload);

    if (!result.data || result.error) {
      useToastStore
        .getState()
        .showToast(result.error ?? Messages.adminHolidays.createError, "error");
      set({ isSaving: false, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadHolidays();
    useToastStore.getState().showToast(Messages.adminHolidays.createSuccess, "success");
    set({ isSaving: false });
    get().closeEditor();
    return true;
  },

  removeHoliday: async (holidayId) => {
    set({ deletingHolidayId: holidayId, isAuthError: false });

    const result = await DeleteAdminHoliday.deleteAdminHoliday(holidayId);

    if (!result.success) {
      useToastStore
        .getState()
        .showToast(result.error ?? Messages.adminHolidays.deleteError, "error");
      set({ deletingHolidayId: null, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadHolidays();
    useToastStore.getState().showToast(Messages.adminHolidays.deleteSuccess, "success");
    set({ deletingHolidayId: null });
    return true;
  },

  syncHolidaysByYear: async () => {
    const year = Number(get().yearFilter);

    if (!Number.isInteger(year) || year < 2020 || year > 2100) {
      useToastStore.getState().showToast(Messages.adminHolidays.invalidYear, "error");
      return false;
    }

    set({ isSyncing: true, isAuthError: false });

    const result = await SyncAdminHolidays.syncAdminHolidays(year);

    if (!result.data || result.error) {
      useToastStore.getState().showToast(result.error ?? Messages.adminHolidays.syncError, "error");
      set({ isSyncing: false, isAuthError: result.isAuthError });
      return false;
    }

    await get().loadHolidays(year);
    useToastStore
      .getState()
      .showToast(Messages.adminHolidays.syncSuccess(result.data.synced), "success");
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
