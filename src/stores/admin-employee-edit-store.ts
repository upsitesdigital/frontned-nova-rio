import { create } from "zustand";
import { startOfMonth, endOfMonth, format } from "date-fns";
import {
  fetchAdminEmployeeById,
  updateAdminEmployee,
  type AdminEmployee,
} from "@/api/admin-employees-api";
import { fetchAdminAppointments, fetchUnits, type RawUnit } from "@/api/admin-appointments-api";
import { useToastStore } from "@/stores/toast-store";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";

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

    try {
      const [employee, units] = await Promise.all([
        fetchAdminEmployeeById(id),
        fetchUnits().catch(() => [] as RawUnit[]),
      ]);
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
    } catch (error) {
      set({
        isLoading: false,
        error: resolveErrorMessage(error, "Erro ao carregar funcionário"),
        isAuthError: isAuthError(error),
      });
    }
  },

  loadUnits: async () => {
    try {
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

    try {
      await updateAdminEmployee(employee.id, {
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
      set({ isSaving: false });
      useToastStore.getState().showToast("Funcionário salvo com sucesso", "success");
      return true;
    } catch (error) {
      const message = resolveErrorMessage(error, "Erro ao salvar funcionário");
      set({ isSaving: false, saveError: message });
      useToastStore.getState().showToast(message, "error");
      return false;
    }
  },

  setCurrentMonth: (date: Date) => {
    set({ currentMonth: date });
    get().loadBusyDates();
  },

  loadBusyDates: async () => {
    const { employee, currentMonth } = get();
    if (!employee) return;

    const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    try {
      const response = await fetchAdminAppointments({
        page: 1,
        limit: 100,
        employeeId: employee.id,
        weekStart: monthStart,
        weekEnd: monthEnd,
        status: "SCHEDULED",
      });
      set({ busyDates: response.data.map((item) => new Date(item.date)) });
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
