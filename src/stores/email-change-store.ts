import { create } from "zustand";

import {
  fetchClientProfile,
  requestEmailChange,
  verifyEmailChange,
} from "@/api/profile-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
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
    const { newEmail } = get();

    if (!isValidEmail(newEmail)) {
      set({ error: MESSAGES.auth.invalidEmail });
      return false;
    }

    set({ isSaving: true, error: null });

    try {
      await requestEmailChange(newEmail);
      set({ isSaving: false, emailChangeStep: "code" });
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: resolveErrorMessage(error, MESSAGES.email.requestError),
      });
      return false;
    }
  },

  submitEmailVerification: async () => {
    const { emailCode, newEmail } = get();
    set({ isSaving: true, error: null });

    try {
      await verifyEmailChange(emailCode, newEmail);
      const profile = await fetchClientProfile();
      const { useProfileInfoStore } = await import("@/stores/profile-info-store");
      useProfileInfoStore.getState().setProfile(profile);
      set({
        isSaving: false,
        emailDialogOpen: false,
        emailChangeStep: "email",
        newEmail: "",
        emailCode: "",
      });
      useToastStore.getState().showToast(MESSAGES.email.changed);
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: resolveErrorMessage(error, MESSAGES.email.verifyError),
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useEmailChangeStore, type EmailChangeStore, type EmailChangeState };
