import { create } from "zustand";

import type { ClientProfile, UpdateProfileData } from "@/api/profile-api";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { loadClientProfile } from "@/use-cases/load-client-profile";
import { updateProfile } from "@/use-cases/update-client-profile";

interface ProfileInfoState {
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
}

interface ProfileInfoActions {
  loadProfile: () => Promise<void>;
  saveProfile: () => Promise<boolean>;
  startEditing: () => void;
  cancelEditing: () => void;
  setEditName: (value: string) => void;
  setEditPhone: (value: string) => void;
  setEditCompany: (value: string) => void;
  setEditCpfCnpj: (value: string) => void;
  setEditAddress: (value: string) => void;
  setProfile: (profile: ClientProfile) => void;
  reset: () => void;
}

type ProfileInfoStore = ProfileInfoState & ProfileInfoActions;

const initialState: ProfileInfoState = {
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
};

const useProfileInfoStore = create<ProfileInfoStore>()((set, get) => ({
  ...initialState,

  loadProfile: async () => {
    set({ isLoading: true, error: null });
    const result = await loadClientProfile();
    if (result.success) {
      set({ profile: result.profile, isLoading: false });
    } else {
      set({ isLoading: false, error: result.error });
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

  setProfile: (profile) => set({ profile }),

  saveProfile: async () => {
    const { editName, editPhone, editCompany, editCpfCnpj, editAddress } = get();
    const data: UpdateProfileData = {
      name: editName,
      phone: editPhone,
      company: editCompany,
      cpfCnpj: editCpfCnpj,
      address: editAddress,
    };

    set({ isSaving: true, error: null });

    const result = await updateProfile(data);
    if (result.success) {
      set({ profile: result.profile, isSaving: false, isEditing: false });
      useToastStore.getState().showToast(MESSAGES.profile.updated);
      return true;
    }
    set({ isSaving: false, error: result.error });
    return false;
  },

  reset: () => set(initialState),
}));

export { useProfileInfoStore, type ProfileInfoStore, type ProfileInfoState };
