import { create } from "zustand";

import type { AdminProfile, UpdateAdminProfileData } from "@/api/admin/admin-profile-api";
import { Messages } from "@/lib/core/messages";
import { useToastStore } from "@/stores/ui/toast-store";
import { LoadAdminProfile } from "@/use-cases/admin-account/load-admin-profile";
import { UpdateAdminProfile } from "@/use-cases/admin-account/update-admin-profile";

export interface AdminProfileInfoState {
  profile: AdminProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  isEditing: boolean;
  editName: string;
}

interface AdminProfileInfoActions {
  loadProfile: () => Promise<void>;
  saveProfile: () => Promise<boolean>;
  startEditing: () => void;
  cancelEditing: () => void;
  setEditName: (value: string) => void;
  setProfile: (profile: AdminProfile) => void;
  reset: () => void;
}

const initialState: AdminProfileInfoState = {
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,

  isEditing: false,
  editName: "",
};

export const useAdminProfileInfoStore = create<AdminProfileInfoState & AdminProfileInfoActions>()(
  (set, get) => ({
    ...initialState,

    loadProfile: async () => {
      set({ isLoading: true, error: null });
      const result = await LoadAdminProfile.loadAdminProfile();
      if (result.success) {
        set({ profile: result.profile, isLoading: false });
      } else {
        set({ isLoading: false, error: result.error });
      }
    },

    startEditing: () => {
      const { profile } = get();
      if (!profile) return;
      set({ isEditing: true, error: null, editName: profile.name });
    },

    cancelEditing: () => set({ isEditing: false, error: null }),

    setEditName: (value) => set({ editName: value }),

    setProfile: (profile) => set({ profile }),

    saveProfile: async () => {
      const { editName } = get();
      const data: UpdateAdminProfileData = { name: editName };

      set({ isSaving: true, error: null });

      const result = await UpdateAdminProfile.updateProfile(data);
      if (result.success) {
        set({ profile: result.profile, isSaving: false, isEditing: false });
        useToastStore.getState().showToast(Messages.profile.updated);
        return true;
      }
      set({ isSaving: false, error: result.error });
      return false;
    },

    reset: () => set(initialState),
  }),
);
