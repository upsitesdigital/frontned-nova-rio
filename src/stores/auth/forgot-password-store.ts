import { create } from "zustand";

import { Messages } from "@/lib/core/messages";
import { RequestPasswordReset } from "@/use-cases/auth/request-password-reset";
import { ResetUserPassword } from "@/use-cases/auth/reset-user-password";
import {
  getPasswordHints,
  validateResetPassword,
  type PasswordHint,
  type ResetPasswordFieldErrors,
} from "@/validation/reset-password-schema";

type ForgotPasswordStep = "email" | "code" | "success";

interface ForgotPasswordState {
  step: ForgotPasswordStep;
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: ResetPasswordFieldErrors;
  passwordHints: PasswordHint[];
}

interface ForgotPasswordActions {
  setEmail: (email: string) => void;
  setCode: (code: string) => void;
  setNewPassword: (newPassword: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  submitEmailStep: () => Promise<boolean>;
  submitCodeStep: () => Promise<boolean>;
  reset: () => void;
}

type ForgotPasswordStore = ForgotPasswordState & ForgotPasswordActions;

const initialState: ForgotPasswordState = {
  step: "email",
  email: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
  isSubmitting: false,
  error: null,
  fieldErrors: {},
  passwordHints: [],
};

const useForgotPasswordStore = create<ForgotPasswordStore>()((set) => ({
  ...initialState,

  setEmail: (email) => set({ email, error: null }),

  setCode: (code) => {
    const digitsOnly = code.replace(/\D/g, "").slice(0, 6);
    set({ code: digitsOnly, error: null, fieldErrors: {} });
  },

  setNewPassword: (newPassword) => {
    const { confirmPassword } = useForgotPasswordStore.getState();
    const passwordHints = newPassword.length > 0 ? getPasswordHints(newPassword) : [];
    const confirmError =
      confirmPassword.length > 0 && newPassword !== confirmPassword
        ? Messages.password.mismatch
        : undefined;

    set({
      newPassword,
      error: null,
      passwordHints,
      fieldErrors: confirmError ? { confirmPassword: confirmError } : {},
    });
  },

  setConfirmPassword: (confirmPassword) => {
    const { newPassword } = useForgotPasswordStore.getState();
    const confirmError =
      confirmPassword.length > 0 && newPassword !== confirmPassword
        ? Messages.password.mismatch
        : undefined;

    set({
      confirmPassword,
      error: null,
      fieldErrors: confirmError ? { confirmPassword: confirmError } : {},
    });
  },

  submitEmailStep: async () => {
    const { email } = useForgotPasswordStore.getState();

    if (!email.trim()) {
      set({ error: Messages.password.fillEmail });
      return false;
    }

    set({ isSubmitting: true, error: null });

    const result = await RequestPasswordReset.requestPasswordResetCode(email);

    if (result.success) {
      set({ isSubmitting: false, step: "code" });
      return true;
    }

    set({ isSubmitting: false, error: result.error });
    return false;
  },

  submitCodeStep: async () => {
    const { email, code, newPassword, confirmPassword } = useForgotPasswordStore.getState();

    const errors = validateResetPassword({ code, newPassword, confirmPassword });

    if (Object.keys(errors).length > 0) {
      set({ fieldErrors: errors });
      return false;
    }

    set({ isSubmitting: true, error: null });

    const result = await ResetUserPassword.resetUserPassword(email, code, newPassword);

    if (result.success) {
      set({ isSubmitting: false, step: "success" });
      return true;
    }

    set({ isSubmitting: false, error: result.error });
    return false;
  },

  reset: () => set(initialState),
}));

export { useForgotPasswordStore, type ForgotPasswordStore, type ForgotPasswordStep };
