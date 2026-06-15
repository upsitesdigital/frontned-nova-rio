import { create } from "zustand";

import { ProfileApi } from "@/api/client/profile-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";
import { useToastStore } from "@/stores/ui/toast-store";
import { isValidEmail } from "@/validation/email-schema";

type EmailChangeStep = "email" | "code";

interface EmailChangeState {
  emailDialogOpen: boolean;
  emailChangeStep: EmailChangeStep;
  newEmail: string;
  emailCode: string;
  isSaving: boolean;
  error: string | null;
}

interface EmailChangeActions {
  openEmailDialog: () => void;
  closeEmailDialog: () => void;
  setNewEmail: (value: string) => void;
  setEmailCode: (value: string) => void;
  submitEmailChange: () => Promise<boolean>;
  submitEmailVerification: () => Promise<boolean>;
  reset: () => void;
}

type EmailChangeStore = EmailChangeState & EmailChangeActions;

const initialState: EmailChangeState = {
  emailDialogOpen: false,
  emailChangeStep: "email",
  newEmail: "",
  emailCode: "",
  isSaving: false,
  error: null,
};

const useEmailChangeStore = create<EmailChangeStore>()((set, get) => ({
  ...initialState,

  openEmailDialog: () => set({ emailDialogOpen: true, error: null }),

  closeEmailDialog: () =>
    set({
      emailDialogOpen: false,
      emailChangeStep: "email",
      newEmail: "",
      emailCode: "",
      error: null,
    }),

  setNewEmail: (value) => set({ newEmail: value }),

  setEmailCode: (value) => set({ emailCode: value }),

  submitEmailChange: async () => {
    const { newEmail, isSaving } = get();
    if (isSaving) return false;

    if (!isValidEmail(newEmail)) {
      set({ error: Messages.auth.invalidEmail });
      return false;
    }

    set({ isSaving: true, error: null });

    try {
      await ProfileApi.requestEmailChange(newEmail);
      set({ isSaving: false, emailChangeStep: "code" });
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.email.requestError),
      });
      return false;
    }
  },

  submitEmailVerification: async () => {
    const { emailCode, newEmail, isSaving } = get();
    if (isSaving) return false;
    set({ isSaving: true, error: null });

    try {
      await ProfileApi.verifyEmailChange(emailCode, newEmail);
      const profile = await ProfileApi.fetchClientProfile();
      const { useProfileInfoStore } = await import("@/stores/client/profile-info-store");
      useProfileInfoStore.getState().setProfile(profile);
      set({
        isSaving: false,
        emailDialogOpen: false,
        emailChangeStep: "email",
        newEmail: "",
        emailCode: "",
      });
      useToastStore.getState().showToast(Messages.email.changed);
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.email.verifyError),
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useEmailChangeStore, type EmailChangeStore, type EmailChangeState };
