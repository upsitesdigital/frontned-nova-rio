import { create } from "zustand";
import type { AdminEmployee } from "@/api/admin-employees-api";
import type { RawUnit } from "@/api/admin-appointments-api";
import { loadAdminEmployeeDetail } from "@/use-cases/load-admin-employee-detail";
import { saveAdminEmployee } from "@/use-cases/save-admin-employee";
import { loadEmployeeBusyDates } from "@/use-cases/load-employee-busy-dates";
import { useToastStore } from "@/stores/toast-store";
import { MESSAGES } from "@/lib/messages";

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  status: string;
  availabilityFrom: string;
  availabilityTo: string;
  unitId: number | null;
  unitName: string;
  notes: string;
  weeklyHours: string;
}

interface AdminEmployeeEditState {
  employee: AdminEmployee | null;
  form: EmployeeFormData;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  isAuthError: boolean;
  currentMonth: Date;
  busyDates: Date[];
  unitOptions: RawUnit[];
}

interface AdminEmployeeEditActions {
  loadEmployee: (id: number) => Promise<void>;
  loadUnits: () => Promise<void>;
  updateField: <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => void;
  saveEmployee: () => Promise<boolean>;
  setCurrentMonth: (date: Date) => void;
  loadBusyDates: () => Promise<void>;
  reset: () => void;
}

type AdminEmployeeEditStore = AdminEmployeeEditState & AdminEmployeeEditActions;

const INITIAL_FORM: EmployeeFormData = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  address: "",
  status: "ACTIVE",
  availabilityFrom: "",
  availabilityTo: "",
  unitId: null,
  unitName: "",
  notes: "",
  weeklyHours: "",
};

const useAdminEmployeeEditStore = create<AdminEmployeeEditStore>((set, get) => ({
  employee: null,
  form: { ...INITIAL_FORM },
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,
  isAuthError: false,
  currentMonth: new Date(),
  busyDates: [],
  unitOptions: [],

  loadEmployee: async (id: number) => {
    set({ isLoading: true, error: null, isAuthError: false });

    const result = await loadAdminEmployeeDetail(id);

    if (result.data) {
      const { employee, units } = result.data;
      set({
        employee,
        unitOptions: units,
        form: {
          name: employee.name,
          email: employee.email,
          phone: employee.phone ?? "",
          cpf: employee.cpf,
          address: employee.address ?? "",
          status: employee.status,
          availabilityFrom: employee.availabilityFrom ?? "",
          availabilityTo: employee.availabilityTo ?? "",
          unitId: employee.unit?.id ?? null,
          unitName: employee.unit?.name ?? "",
          notes: employee.notes ?? "",
          weeklyHours: "",
        },
        isLoading: false,
      });
      get().loadBusyDates();
    } else {
      set({
        isLoading: false,
        error: result.error,
        isAuthError: result.isAuthError,
      });
    }
  },

  loadUnits: async () => {
    try {
      const { fetchUnits } = await import("@/api/admin-appointments-api");
      const units = await fetchUnits();
      set({ unitOptions: units });
    } catch {
      // Silent fail — non-critical
    }
  },

  updateField: (field, value) => {
    set((state) => ({
      form: { ...state.form, [field]: value },
    }));
  },

  saveEmployee: async () => {
    const { employee, form } = get();
    if (!employee) return false;

    set({ isSaving: true, saveError: null });

    const result = await saveAdminEmployee({
      id: employee.id,
      name: form.name,
      email: form.email,
      cpf: form.cpf,
      phone: form.phone || undefined,
      address: form.address || undefined,
      availabilityFrom: form.availabilityFrom || undefined,
      availabilityTo: form.availabilityTo || undefined,
      notes: form.notes || undefined,
      unitId: form.unitId ?? undefined,
      status: form.status as "ACTIVE" | "INACTIVE",
    });

    if (result.success) {
      set({ isSaving: false });
      useToastStore.getState().showToast(MESSAGES.adminEmployees.saveSuccess, "success");
      return true;
    }

    set({ isSaving: false, saveError: result.error });
    useToastStore.getState().showToast(result.error, "error");
    return false;
  },

  setCurrentMonth: (date: Date) => {
    set({ currentMonth: date });
    get().loadBusyDates();
  },

  loadBusyDates: async () => {
    const { employee, currentMonth } = get();
    if (!employee) return;

    try {
      const dates = await loadEmployeeBusyDates({
        employeeId: employee.id,
        currentMonth,
      });
      set({ busyDates: dates });
    } catch {
      // Silent fail for calendar — non-critical
    }
  },

  reset: () => {
    set({
      employee: null,
      form: { ...INITIAL_FORM },
      isLoading: false,
      isSaving: false,
      error: null,
      saveError: null,
      isAuthError: false,
      currentMonth: new Date(),
      busyDates: [],
      unitOptions: [],
    });
  },
}));

export { useAdminEmployeeEditStore, type AdminEmployeeEditStore, type EmployeeFormData };
