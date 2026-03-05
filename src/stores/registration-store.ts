import { create } from "zustand";

import type { RegisterFieldErrors } from "@/validation/register-schema";
import {
  validateRegistrationInput,
  executeRegistration,
} from "@/use-cases/submit-registration";

interface RegistrationState {
  name: string;
  email: string;
  phone: string;
  password: string;
  isRegistering: boolean;
  errors: RegisterFieldErrors;
  success: boolean;
}

interface RegistrationActions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  submit: () => Promise<boolean>;
  reset: () => void;
}

type RegistrationStore = RegistrationState & RegistrationActions;

const initialState: RegistrationState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  isRegistering: false,
  errors: {},
  success: false,
};

const useRegistrationStore = create<RegistrationStore>()((set) => ({
  ...initialState,

  setName: (name) => set({ name, errors: {} }),
  setEmail: (email) => set({ email, errors: {} }),
  setPhone: (phone) => set({ phone, errors: {} }),
  setPassword: (password) => set({ password, errors: {} }),

  submit: async () => {
    const { name, email, phone, password } = useRegistrationStore.getState();

    const validationErrors = validateRegistrationInput({ name, email, phone, password });
    if (Object.keys(validationErrors).length > 0) {
      set({ errors: validationErrors });
      return false;
    }

    set({ isRegistering: true, errors: {} });
    const apiErrors = await executeRegistration({ name, email, phone, password });

    if (Object.keys(apiErrors).length === 0) {
      set({ isRegistering: false, success: true });
      return true;
    }

    set({ isRegistering: false, errors: apiErrors });
    return false;
  },

  reset: () => set(initialState),
}));

export { useRegistrationStore, type RegistrationStore };
