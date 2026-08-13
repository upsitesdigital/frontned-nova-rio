import { create } from "zustand";

import { Formatters } from "@/lib/formatting/formatters";
import { RegisterNewAccount } from "@/use-cases/auth/register-new-account";
import {
  validateCreateAccount,
  type CreateAccountFieldErrors,
} from "@/validation/create-account-schema";

interface CreateAccountState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isSubmitting: boolean;
  errors: CreateAccountFieldErrors;
}

interface CreateAccountActions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  submit: () => Promise<boolean>;
  reset: () => void;
}

const initialState: CreateAccountState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  isSubmitting: false,
  errors: {},
};

export const useCreateAccountStore = create<CreateAccountState & CreateAccountActions>()(
  (set, get) => ({
    ...initialState,

    setName: (name) => set({ name, errors: {} }),
    setEmail: (email) => set({ email, errors: {} }),
    setPhone: (phone) => set({ phone, errors: {} }),
    setPassword: (password) => set({ password, errors: {} }),
    setConfirmPassword: (confirmPassword) => set({ confirmPassword, errors: {} }),

    submit: async () => {
      if (get().isSubmitting) return false;
      const { name, email, phone, password, confirmPassword } = useCreateAccountStore.getState();

      const validationErrors = validateCreateAccount({
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      if (Object.keys(validationErrors).length > 0) {
        set({ errors: validationErrors });
        return false;
      }

      set({ isSubmitting: true, errors: {} });

      const normalizedPhone = Formatters.onlyDigits(phone);

      const errors = await RegisterNewAccount.registerNewAccount({
        name,
        email,
        phone: normalizedPhone || undefined,
        password,
      });

      if (Object.keys(errors).length > 0) {
        set({ isSubmitting: false, errors });
        return false;
      }

      set({ isSubmitting: false });
      return true;
    },

    reset: () => set(initialState),
  }),
);
