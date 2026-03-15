import { create } from "zustand";

import { deleteClientAccount } from "@/api/profile-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface DeleteAccountState {
  deleteDialogOpen: boolean;
  deletePhrase: string;
  isSaving: boolean;
  error: string | null;
}

interface DeleteAccountActions {
  openDeleteDialog: () => void;
  closeDeleteDialog: () => void;
  setDeletePhrase: (value: string) => void;
  submitDeleteAccount: () => Promise<boolean>;
  reset: () => void;
}

type DeleteAccountStore = DeleteAccountState & DeleteAccountActions;

const initialState: DeleteAccountState = {
  deleteDialogOpen: false,
  deletePhrase: "",
  isSaving: false,
  error: null,
};

const useDeleteAccountStore = create<DeleteAccountStore>()((set, get) => ({
  ...initialState,

  openDeleteDialog: () => set({ deleteDialogOpen: true, error: null }),

  closeDeleteDialog: () => set({ deleteDialogOpen: false, deletePhrase: "", error: null }),

  setDeletePhrase: (value) => set({ deletePhrase: value }),

  submitDeleteAccount: async () => {
    const { deletePhrase } = get();
    set({ isSaving: true, error: null });

    try {
      await deleteClientAccount(deletePhrase);
      const { useAuthStore } = await import("@/stores/auth-store");
      useAuthStore.getState().reset();
      set(initialState);
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: resolveErrorMessage(error, MESSAGES.profile.deleteError),
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useDeleteAccountStore, type DeleteAccountStore, type DeleteAccountState };
