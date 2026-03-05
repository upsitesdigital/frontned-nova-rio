import { create } from "zustand";

import { registerClient } from "@/api/auth-api";
import { HttpClientError } from "@/api/http-client";
import { getCoverageByCep, getTimeSlots } from "@/api/scheduling-data";
import { getServices } from "@/api/services-data";
import type { Address, RecurrenceFrequency, RecurrenceType, TimeSlot } from "@/types/scheduling";
import type { Service } from "@/types/service";
import {
  validateRegister,
  mapApiErrorToField,
  type RegisterFieldErrors,
} from "@/validation/register-schema";

interface SchedulingState {
  services: Service[];
  isLoadingServices: boolean;
  selectedServiceId: number | null;
  recurrenceType: RecurrenceType | null;
  recurrenceFrequency: RecurrenceFrequency | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  timeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
  cep: string;
  address: Address | null;
  isLoadingAddress: boolean;
  cepError: string | null;
  registerName: string;
  registerEmail: string;
  registerPhone: string;
  registerPassword: string;
  isRegistering: boolean;
  registerErrors: RegisterFieldErrors;
  registerSuccess: boolean;
}

interface SchedulingActions {
  loadServices: () => Promise<void>;
  setSelectedServiceId: (id: number) => void;
  setRecurrenceType: (type: RecurrenceType) => void;
  setRecurrenceFrequency: (frequency: RecurrenceFrequency) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  loadTimeSlots: (date: string) => Promise<void>;
  setCep: (cep: string) => void;
  loadAddressByCep: (cep: string) => Promise<void>;
  clearAddress: () => void;
  setRegisterName: (name: string) => void;
  setRegisterEmail: (email: string) => void;
  setRegisterPhone: (phone: string) => void;
  setRegisterPassword: (password: string) => void;
  submitRegistration: () => Promise<boolean>;
  reset: () => void;
}

type SchedulingStore = SchedulingState & SchedulingActions;

const initialState: SchedulingState = {
  services: [],
  isLoadingServices: false,
  selectedServiceId: null,
  recurrenceType: null,
  recurrenceFrequency: null,
  selectedDate: null,
  selectedTime: null,
  timeSlots: [],
  isLoadingTimeSlots: false,
  cep: "",
  address: null,
  isLoadingAddress: false,
  cepError: null,
  registerName: "",
  registerEmail: "",
  registerPhone: "",
  registerPassword: "",
  isRegistering: false,
  registerErrors: {},
  registerSuccess: false,
};

const useSchedulingStore = create<SchedulingStore>()((set) => ({
  ...initialState,

  loadServices: async () => {
    set({ isLoadingServices: true });
    try {
      const services = await getServices();
      set({ services, isLoadingServices: false });
    } catch {
      set({ isLoadingServices: false });
    }
  },

  setSelectedServiceId: (id) => set({ selectedServiceId: id }),

  setRecurrenceType: (type) =>
    set({ recurrenceType: type, recurrenceFrequency: type === "recorrencia" ? "mensal" : null }),

  setRecurrenceFrequency: (frequency) => set({ recurrenceFrequency: frequency }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setSelectedTime: (time) => set({ selectedTime: time }),

  loadTimeSlots: async (date) => {
    set({ isLoadingTimeSlots: true });
    try {
      const timeSlots = await getTimeSlots(date);
      set({ timeSlots, isLoadingTimeSlots: false });
    } catch {
      set({ timeSlots: [], isLoadingTimeSlots: false });
    }
  },

  setCep: (cep) => set({ cep }),

  loadAddressByCep: async (cep) => {
    set({ isLoadingAddress: true, cepError: null });
    try {
      const result = await getCoverageByCep(cep);
      if (!result.covered) {
        set({
          address: null,
          isLoadingAddress: false,
          cepError: "Endereço fora da área de atendimento",
        });
        return;
      }
      set({ address: result.address, isLoadingAddress: false });
    } catch {
      set({ address: null, isLoadingAddress: false, cepError: "CEP não encontrado" });
    }
  },

  clearAddress: () => set({ address: null, cepError: null }),

  setRegisterName: (name) => set({ registerName: name, registerErrors: {} }),
  setRegisterEmail: (email) => set({ registerEmail: email, registerErrors: {} }),
  setRegisterPhone: (phone) => set({ registerPhone: phone, registerErrors: {} }),
  setRegisterPassword: (password) => set({ registerPassword: password, registerErrors: {} }),

  submitRegistration: async () => {
    const { registerName, registerEmail, registerPhone, registerPassword } =
      useSchedulingStore.getState();

    const errors = validateRegister({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
    });

    if (Object.keys(errors).length > 0) {
      set({ registerErrors: errors });
      return false;
    }

    set({ isRegistering: true, registerErrors: {} });
    try {
      await registerClient({
        name: registerName,
        email: registerEmail,
        phone: registerPhone || undefined,
        password: registerPassword,
      });
      set({ isRegistering: false, registerSuccess: true });
      return true;
    } catch (error) {
      const fieldErrors =
        error instanceof HttpClientError
          ? mapApiErrorToField(error.status, error.message)
          : { email: "Erro ao cadastrar. Tente novamente." };
      set({ isRegistering: false, registerErrors: fieldErrors });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useSchedulingStore, type SchedulingStore };
