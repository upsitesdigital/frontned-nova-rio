import { create } from "zustand";

import { DeleteClientAccount } from "@/use-cases/client-account/delete-client-account";

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
    const { deletePhrase, isSaving } = get();
    if (isSaving) return false;
    set({ isSaving: true, error: null });

    const result = await DeleteClientAccount.removeClientAccount(deletePhrase);

    if (result.success) {
      const { useAuthStore } = await import("@/stores/auth/auth-store");
      useAuthStore.getState().reset();
      set(initialState);
      return true;
    }

    set({ isSaving: false, error: result.error });
    return false;
  },

  reset: () => set(initialState),
}));

export { useDeleteAccountStore, type DeleteAccountStore, type DeleteAccountState };
