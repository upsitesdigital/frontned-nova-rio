import { create } from "zustand";

import { submitAdminAppointment, type RecurrenceType } from "@/use-cases/create-admin-appointment";
import {
  getActiveEmployeeOptions,
  type EmployeeOption,
} from "@/use-cases/get-active-employee-options";
import {
  getAdminServiceOptions,
  type AdminServiceOption,
} from "@/use-cases/get-admin-service-options";
import {
  getApprovedClientOptions,
  type ClientOption,
} from "@/use-cases/get-approved-client-options";

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 h" },
  { value: 90, label: "1 h 30 min" },
  { value: 120, label: "2 h" },
  { value: 180, label: "3 h" },
  { value: 240, label: "4 h" },
];

interface AdminCreateAppointmentState {
  serviceId: string;
  recurrenceType: RecurrenceType;
  duration: string;
  clientId: string;
  employeeId: string;
  locationZip: string;
  notes: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  clientOptions: ClientOption[];
  serviceOptions: AdminServiceOption[];
  employeeOptions: EmployeeOption[];
  employeeConflict: string | null;
  isOptionsLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isAuthError: boolean;
  success: boolean;
}

interface AdminCreateAppointmentActions {
  setServiceId: (value: string) => void;
  setRecurrenceType: (value: RecurrenceType) => void;
  setDuration: (value: string) => void;
  setClientId: (value: string) => void;
  setEmployeeId: (value: string) => void;
  setLocationZip: (value: string) => void;
  setNotes: (value: string) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTime: (time: string) => void;
  loadOptions: () => Promise<void>;
  submitAppointment: () => Promise<boolean>;
  reset: () => void;
}

type AdminCreateAppointmentStore = AdminCreateAppointmentState & AdminCreateAppointmentActions;

const initialState: AdminCreateAppointmentState = {
  serviceId: "",
  recurrenceType: "SINGLE",
  duration: "60",
  clientId: "",
  employeeId: "",
  locationZip: "",
  notes: "",
  selectedDate: undefined,
  selectedTime: "",
  clientOptions: [],
  serviceOptions: [],
  employeeOptions: [],
  employeeConflict: null,
  isOptionsLoading: false,
  isSubmitting: false,
  error: null,
  isAuthError: false,
  success: false,
};

const useAdminCreateAppointmentStore = create<AdminCreateAppointmentStore>()((set, get) => ({
  ...initialState,

  setServiceId: (value) => set({ serviceId: value, error: null }),
  setRecurrenceType: (value) => set({ recurrenceType: value, error: null }),
  setDuration: (value) => set({ duration: value, error: null }),
  setClientId: (value) => set({ clientId: value, error: null }),
  setEmployeeId: (value) => set({ employeeId: value, employeeConflict: null, error: null }),
  setLocationZip: (value) => set({ locationZip: value, error: null }),
  setNotes: (value) => set({ notes: value, error: null }),
  setSelectedDate: (date) => set({ selectedDate: date, error: null }),
  setSelectedTime: (time) => set({ selectedTime: time, error: null }),

  loadOptions: async () => {
    set({ isOptionsLoading: true });
    try {
      const [clientsResult, servicesResult, employeesResult] = await Promise.allSettled([
        getApprovedClientOptions(),
        getAdminServiceOptions(),
        getActiveEmployeeOptions(),
      ]);
      set({
        clientOptions: clientsResult.status === "fulfilled" ? (clientsResult.value.data ?? []) : [],
        serviceOptions:
          servicesResult.status === "fulfilled" ? (servicesResult.value.data ?? []) : [],
        employeeOptions:
          employeesResult.status === "fulfilled" ? (employeesResult.value.data ?? []) : [],
        isOptionsLoading: false,
      });
    } catch {
      set({ isOptionsLoading: false });
    }
  },

  submitAppointment: async () => {
    const state = get();
    set({ isSubmitting: true, error: null, employeeConflict: null });

    const result = await submitAdminAppointment({
      serviceId: state.serviceId,
      recurrenceType: state.recurrenceType,
      duration: state.duration,
      clientId: state.clientId,
      employeeId: state.employeeId,
      locationZip: state.locationZip,
      notes: state.notes,
      selectedDate: state.selectedDate,
      selectedTime: state.selectedTime,
    });

    switch (result.type) {
      case "success":
        set({ isSubmitting: false, success: true });
        return true;
      case "validation_error":
        set({ isSubmitting: false, error: result.message });
        return false;
      case "employee_conflict":
        set({ isSubmitting: false, employeeConflict: result.message });
        return false;
      case "auth_error":
        set({ isSubmitting: false, error: result.message, isAuthError: true });
        return false;
      case "error":
        set({ isSubmitting: false, error: result.message });
        return false;
    }
  },

  reset: () => set(initialState),
}));

export { useAdminCreateAppointmentStore, DURATION_OPTIONS, type AdminCreateAppointmentStore };
