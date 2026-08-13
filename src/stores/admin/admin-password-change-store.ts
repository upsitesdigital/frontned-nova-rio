import { create } from "zustand";

import { AdminProfileApi } from "@/api/admin/admin-profile-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";
import { useToastStore } from "@/stores/ui/toast-store";
import {
  validatePasswordStrength,
  validatePasswordMatch,
} from "@/validation/password-strength-schema";

type PasswordChangeStep = "request" | "verify";

interface AdminPasswordChangeState {
  passwordDialogOpen: boolean;
  passwordChangeStep: PasswordChangeStep;
  passwordCode: string;
  newPassword: string;
  confirmPassword: string;
  isSaving: boolean;
  error: string | null;
}

interface AdminPasswordChangeActions {
  openPasswordDialog: () => void;
  closePasswordDialog: () => void;
  setPasswordCode: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  submitPasswordChange: () => Promise<boolean>;
  submitPasswordVerification: () => Promise<boolean>;
  reset: () => void;
}

type AdminPasswordChangeStore = AdminPasswordChangeState & AdminPasswordChangeActions;

const initialState: AdminPasswordChangeState = {
  passwordDialogOpen: false,
  passwordChangeStep: "request",
  passwordCode: "",
  newPassword: "",
  confirmPassword: "",
  isSaving: false,
  error: null,
};

const useAdminPasswordChangeStore = create<AdminPasswordChangeStore>()((set, get) => ({
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
    if (get().isSaving) return false;
    set({ isSaving: true, error: null });

    try {
      await AdminProfileApi.requestPasswordChange();
      set({ isSaving: false, passwordChangeStep: "verify" });
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.password.requestError),
      });
      return false;
    }
  },

  submitPasswordVerification: async () => {
    const { passwordCode, newPassword, confirmPassword, isSaving } = get();
    if (isSaving) return false;

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
      await AdminProfileApi.verifyPasswordChange(passwordCode, newPassword);
      set({
        isSaving: false,
        passwordDialogOpen: false,
        passwordChangeStep: "request",
        passwordCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      useToastStore.getState().showToast(Messages.password.changed);
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.password.verifyError),
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export {
  useAdminPasswordChangeStore,
  type AdminPasswordChangeStore,
  type AdminPasswordChangeState,
};
