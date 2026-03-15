import { create } from "zustand";

import {
  requestPasswordChange,
  verifyPasswordChange,
} from "@/api/profile-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import {
  validatePasswordStrength,
  validatePasswordMatch,
} from "@/validation/password-strength-schema";

type PasswordChangeStep = "request" | "verify";

interface PasswordChangeState {
  passwordDialogOpen: boolean;
  passwordChangeStep: PasswordChangeStep;
  passwordCode: string;
  newPassword: string;
  confirmPassword: string;
  isSaving: boolean;
  error: string | null;
}

interface PasswordChangeActions {
  openPasswordDialog: () => void;
  closePasswordDialog: () => void;
  setPasswordCode: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  submitPasswordChange: () => Promise<boolean>;
  submitPasswordVerification: () => Promise<boolean>;
  reset: () => void;
}

type PasswordChangeStore = PasswordChangeState & PasswordChangeActions;

const initialState: PasswordChangeState = {
  passwordDialogOpen: false,
  passwordChangeStep: "request",
  passwordCode: "",
  newPassword: "",
  confirmPassword: "",
  isSaving: false,
  error: null,
};

const usePasswordChangeStore = create<PasswordChangeStore>()((set, get) => ({
  ...initialState,

  openPasswordDialog: () => set({ passwordDialogOpen: true, error: null }),

  closePasswordDialog: () =>
    set({
      passwordDialogOpen: false,
      passwordChangeStep: "request",
      passwordCode: "",
      newPassword: "",
      confirmPassword: "",
      error: null,
    }),

  setPasswordCode: (value) => set({ passwordCode: value }),
  setNewPassword: (value) => set({ newPassword: value }),
  setConfirmPassword: (value) => set({ confirmPassword: value }),

  submitPasswordChange: async () => {
    set({ isSaving: true, error: null });

    try {
      await requestPasswordChange();
      set({ isSaving: false, passwordChangeStep: "verify" });
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: resolveErrorMessage(error, MESSAGES.password.requestError),
      });
      return false;
    }
  },

  submitPasswordVerification: async () => {
    const { passwordCode, newPassword, confirmPassword } = get();

    const matchError = validatePasswordMatch(newPassword, confirmPassword);
    if (matchError) {
      set({ error: matchError });
      return false;
    }

    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      set({ error: strengthError });
      return false;
    }

    set({ isSaving: true, error: null });

    try {
      await verifyPasswordChange(passwordCode, newPassword);
      set({
        isSaving: false,
        passwordDialogOpen: false,
        passwordChangeStep: "request",
        passwordCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      useToastStore.getState().showToast(MESSAGES.password.changed);
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: resolveErrorMessage(error, MESSAGES.password.verifyError),
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { usePasswordChangeStore, type PasswordChangeStore, type PasswordChangeState };
