import { create } from "zustand";

import {
  fetchClientOptions,
  fetchServiceOptions,
  fetchEmployeeOptions,
  createAdminAppointment,
  type ClientOption,
  type ServiceOption as ApiServiceOption,
  type EmployeeOption,
} from "@/api/admin-appointments-api";
import { HttpClientError } from "@/api/http-client";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

type RecurrenceType = "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

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
  serviceOptions: ApiServiceOption[];
  employeeOptions: EmployeeOption[];
  employeeConflict: string | null;
  isOptionsLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
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
  success: false,
};

function validateForm(state: AdminCreateAppointmentState): string | null {
  if (!state.serviceId) return MESSAGES.adminAppointments.requiredService;
  if (!state.clientId) return MESSAGES.adminAppointments.requiredClient;
  if (!state.selectedDate) return MESSAGES.adminAppointments.requiredDate;
  if (!state.selectedTime) return MESSAGES.adminAppointments.requiredTime;
  return null;
}

function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
      const [clients, services, employees] = await Promise.allSettled([
        fetchClientOptions(),
        fetchServiceOptions(),
        fetchEmployeeOptions(),
      ]);
      set({
        clientOptions: clients.status === "fulfilled" ? clients.value : [],
        serviceOptions: services.status === "fulfilled" ? services.value : [],
        employeeOptions: employees.status === "fulfilled" ? employees.value : [],
        isOptionsLoading: false,
      });
    } catch {
      set({ isOptionsLoading: false });
    }
  },

  submitAppointment: async () => {
    const state = get();
    const validationError = validateForm(state);
    if (validationError) {
      set({ error: validationError });
      return false;
    }

    set({ isSubmitting: true, error: null, employeeConflict: null });

    try {
      await createAdminAppointment({
        date: formatDateToISO(state.selectedDate!),
        startTime: state.selectedTime,
        duration: Number(state.duration),
        recurrenceType: state.recurrenceType,
        clientId: Number(state.clientId),
        serviceId: Number(state.serviceId),
        employeeId:
          state.employeeId && state.employeeId !== "none" ? Number(state.employeeId) : undefined,
        locationZip: state.locationZip || undefined,
        notes: state.notes || undefined,
      });

      set({ isSubmitting: false, success: true });
      return true;
    } catch (error) {
      const message =
        error instanceof HttpClientError
          ? error.message
          : resolveErrorMessage(error, MESSAGES.adminAppointments.createError);

      const isEmployeeConflict =
        error instanceof HttpClientError &&
        error.status === 400 &&
        message.toLowerCase().includes("conflict");

      set({
        isSubmitting: false,
        error: isEmployeeConflict ? null : message,
        employeeConflict: isEmployeeConflict ? message : null,
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useAdminCreateAppointmentStore, DURATION_OPTIONS, type AdminCreateAppointmentStore };
