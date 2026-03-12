import { create } from "zustand";

import {
  fetchClientProfile,
  updateClientProfile,
  requestEmailChange,
  verifyEmailChange,
  requestPasswordChange,
  verifyPasswordChange,
  deleteClientAccount,
  type ClientProfile,
  type UpdateProfileData,
} from "@/api/profile-api";
import { HttpClientError } from "@/api/http-client";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";

type EmailChangeStep = "email" | "code";
type PasswordChangeStep = "request" | "verify";

interface ProfileState {
  profile: ClientProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  isEditing: boolean;
  editName: string;
  editPhone: string;
  editCompany: string;
  editCpfCnpj: string;
  editAddress: string;

  emailDialogOpen: boolean;
  emailChangeStep: EmailChangeStep;
  newEmail: string;
  emailCode: string;

  passwordDialogOpen: boolean;
  passwordChangeStep: PasswordChangeStep;
  passwordCode: string;
  newPassword: string;
  confirmPassword: string;

  deleteDialogOpen: boolean;
  deletePhrase: string;
}

interface ProfileActions {
  loadProfile: () => Promise<void>;
  saveProfile: () => Promise<boolean>;
  startEditing: () => void;
  cancelEditing: () => void;
  setEditName: (value: string) => void;
  setEditPhone: (value: string) => void;
  setEditCompany: (value: string) => void;
  setEditCpfCnpj: (value: string) => void;
  setEditAddress: (value: string) => void;

  openEmailDialog: () => void;
  closeEmailDialog: () => void;
  setNewEmail: (value: string) => void;
  setEmailCode: (value: string) => void;
  submitEmailChange: () => Promise<boolean>;
  submitEmailVerification: () => Promise<boolean>;

  openPasswordDialog: () => void;
  closePasswordDialog: () => void;
  setPasswordCode: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  submitPasswordChange: () => Promise<boolean>;
  submitPasswordVerification: () => Promise<boolean>;

  openDeleteDialog: () => void;
  closeDeleteDialog: () => void;
  setDeletePhrase: (value: string) => void;
  submitDeleteAccount: () => Promise<boolean>;

  reset: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,

  isEditing: false,
  editName: "",
  editPhone: "",
  editCompany: "",
  editCpfCnpj: "",
  editAddress: "",

  emailDialogOpen: false,
  emailChangeStep: "email",
  newEmail: "",
  emailCode: "",

  passwordDialogOpen: false,
  passwordChangeStep: "request",
  passwordCode: "",
  newPassword: "",
  confirmPassword: "",

  deleteDialogOpen: false,
  deletePhrase: "",
};

function getToken(): string | null {
  return useAuthStore.getState().accessToken;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof HttpClientError ? error.message : fallback;
}

const useProfileStore = create<ProfileStore>()((set, get) => ({
  ...initialState,

  loadProfile: async () => {
    await waitForAuthHydration();

    const token = getToken();
    if (!token) {
      set({ error: "Sessão expirada. Faça login novamente." });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const profile = await fetchClientProfile(token);
      set({ profile, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error, "Erro ao carregar o perfil. Tente novamente."),
      });
    }
  },

  startEditing: () => {
    const { profile } = get();
    if (!profile) return;
    set({
      isEditing: true,
      error: null,
      editName: profile.name,
      editPhone: profile.phone ?? "",
      editCompany: profile.company ?? "",
      editCpfCnpj: profile.cpfCnpj ?? "",
      editAddress: profile.address ?? "",
    });
  },

  cancelEditing: () => set({ isEditing: false, error: null }),

  setEditName: (value) => set({ editName: value }),
  setEditPhone: (value) => set({ editPhone: value }),
  setEditCompany: (value) => set({ editCompany: value }),
  setEditCpfCnpj: (value) => set({ editCpfCnpj: value }),
  setEditAddress: (value) => set({ editAddress: value }),

  saveProfile: async () => {
    await waitForAuthHydration();

    const token = getToken();
    if (!token) {
      set({ error: "Sessão expirada. Faça login novamente." });
      return false;
    }

    const { editName, editPhone, editCompany, editCpfCnpj, editAddress } = get();
    const data: UpdateProfileData = {
      name: editName,
      phone: editPhone,
      company: editCompany,
      cpfCnpj: editCpfCnpj,
      address: editAddress,
    };

    set({ isSaving: true, error: null });

    try {
      const profile = await updateClientProfile(token, data);
      set({ profile, isSaving: false, isEditing: false });
      useToastStore.getState().showToast("Perfil atualizado com sucesso!");
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: getErrorMessage(error, "Erro ao salvar o perfil. Tente novamente."),
      });
      return false;
    }
  },

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
    const token = getToken();
    if (!token) {
      set({ error: "Sessão expirada. Faça login novamente." });
      return false;
    }

    const { newEmail } = get();
    set({ isSaving: true, error: null });

    try {
      await requestEmailChange(token, newEmail);
      set({ isSaving: false, emailChangeStep: "code" });
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: getErrorMessage(error, "Erro ao solicitar alteração de e-mail."),
      });
      return false;
    }
  },

  submitEmailVerification: async () => {
    const token = getToken();
    if (!token) {
      set({ error: "Sessão expirada. Faça login novamente." });
      return false;
    }

    const { emailCode, newEmail } = get();
    set({ isSaving: true, error: null });

    try {
      await verifyEmailChange(token, emailCode, newEmail);
      const profile = await fetchClientProfile(token);
      set({
        profile,
        isSaving: false,
        emailDialogOpen: false,
        emailChangeStep: "email",
        newEmail: "",
        emailCode: "",
      });
      useToastStore.getState().showToast("E-mail alterado com sucesso!");
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: getErrorMessage(error, "Erro ao verificar código. Tente novamente."),
      });
      return false;
    }
  },

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
    const token = getToken();
    if (!token) {
      set({ error: "Sessão expirada. Faça login novamente." });
      return false;
    }

    set({ isSaving: true, error: null });

    try {
      await requestPasswordChange(token);
      set({ isSaving: false, passwordChangeStep: "verify" });
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: getErrorMessage(error, "Erro ao solicitar alteração de senha."),
      });
      return false;
    }
  },

  submitPasswordVerification: async () => {
    const token = getToken();
    if (!token) {
      set({ error: "Sessão expirada. Faça login novamente." });
      return false;
    }

    const { passwordCode, newPassword } = get();
    set({ isSaving: true, error: null });

    try {
      await verifyPasswordChange(token, passwordCode, newPassword);
      set({
        isSaving: false,
        passwordDialogOpen: false,
        passwordChangeStep: "request",
        passwordCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      useToastStore.getState().showToast("Senha alterada com sucesso!");
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: getErrorMessage(error, "Erro ao alterar senha. Tente novamente."),
      });
      return false;
    }
  },

  openDeleteDialog: () => set({ deleteDialogOpen: true, error: null }),
  closeDeleteDialog: () => set({ deleteDialogOpen: false, deletePhrase: "", error: null }),
  setDeletePhrase: (value) => set({ deletePhrase: value }),

  submitDeleteAccount: async () => {
    const token = getToken();
    if (!token) {
      set({ error: "Sessão expirada. Faça login novamente." });
      return false;
    }

    const { deletePhrase } = get();
    set({ isSaving: true, error: null });

    try {
      await deleteClientAccount(token, deletePhrase);
      useAuthStore.getState().reset();
      set(initialState);
      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: getErrorMessage(error, "Erro ao excluir conta. Tente novamente."),
      });
      return false;
    }
  },

  reset: () => set(initialState),
}));

export { useProfileStore, type ProfileStore, type ProfileState };
