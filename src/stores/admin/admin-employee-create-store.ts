import { create } from "zustand";
import type { RawUnit } from "@/api/admin/admin-appointments-api";
import { CreateAdminEmployee } from "@/use-cases/admin-employees/create-admin-employee";
import { useToastStore } from "@/stores/ui/toast-store";
import { Messages } from "@/lib/core/messages";

export interface EmployeeCreateFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  availabilityFrom: string;
  availabilityTo: string;
  unitId: number | null;
  unitName: string;
  notes: string;
}

interface AdminEmployeeCreateState {
  form: EmployeeCreateFormData;
  isSaving: boolean;
  saveError: string | null;
  unitOptions: RawUnit[];
}

interface AdminEmployeeCreateActions {
  loadUnits: () => Promise<void>;
  updateField: <K extends keyof EmployeeCreateFormData>(
    field: K,
    value: EmployeeCreateFormData[K],
  ) => void;
  createEmployee: () => Promise<boolean>;
  reset: () => void;
}

type AdminEmployeeCreateStore = AdminEmployeeCreateState & AdminEmployeeCreateActions;

const initialForm: EmployeeCreateFormData = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  address: "",
  availabilityFrom: "",
  availabilityTo: "",
  unitId: null,
  unitName: "",
  notes: "",
};

export const useAdminEmployeeCreateStore = create<AdminEmployeeCreateStore>((set, get) => ({
  form: { ...initialForm },
  isSaving: false,
  saveError: null,
  unitOptions: [],

  loadUnits: async () => {
    try {
      const { AdminAppointmentsApi } = await import("@/api/admin/admin-appointments-api");
      const units = await AdminAppointmentsApi.fetchUnits();
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

  createEmployee: async () => {
    const { form } = get();
    if (get().isSaving) return false;

    set({ isSaving: true, saveError: null });

    const result = await CreateAdminEmployee.createAdminEmployee({
      name: form.name,
      email: form.email,
      cpf: form.cpf,
      phone: form.phone || null,
      address: form.address || null,
      availabilityFrom: form.availabilityFrom || null,
      availabilityTo: form.availabilityTo || null,
      notes: form.notes || null,
      unitId: form.unitId ?? null,
    });

    if (result.success) {
      set({ isSaving: false });
      useToastStore.getState().showToast(Messages.adminEmployees.createSuccess, "success");
      return true;
    }

    set({ isSaving: false, saveError: result.error });
    useToastStore.getState().showToast(result.error, "error");
    return false;
  },

  reset: () => {
    set({
      form: { ...initialForm },
      isSaving: false,
      saveError: null,
      unitOptions: [],
    });
  },
}));
