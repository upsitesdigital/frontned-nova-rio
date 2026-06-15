import { create } from "zustand";

import type { AdminProfile } from "@/api/core/auth-api";
import { AppConfig } from "@/config/app";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";
import {
  LoadAdminDashboard,
  type AdminDashboardData,
} from "@/use-cases/admin-reports/load-admin-dashboard";

interface AdminProfileState {
  profile: AdminProfile | null;
  todayAppointmentsCount: number;
  activeClientsCount: number;
  pendingServicesCount: number;
  isLoading: boolean;
  error: string | null;
  isAuthError: boolean;
}

interface AdminProfileActions {
  loadDashboard: () => Promise<AdminDashboardData | null>;
  reset: () => void;
}

type AdminProfileStore = AdminProfileState & AdminProfileActions;

const initialState: AdminProfileState = {
  profile: null,
  todayAppointmentsCount: 0,
  activeClientsCount: 0,
  pendingServicesCount: 0,
  isLoading: false,
  error: null,
  isAuthError: false,
};

const useAdminProfileStore = create<AdminProfileStore>()((set, get) => ({
  ...initialState,

  loadDashboard: async () => {
    if (get().profile && !get().error) return null;

    set({ isLoading: true, error: null });

    try {
      const result = await LoadAdminDashboard.loadAdminDashboardData(AppConfig.agendaPageSize);

      if (result.error || !result.data) {
        set({
          isLoading: false,
          error: result.error,
          isAuthError: result.isAuthError,
        });
        return null;
      }

      set({
        profile: result.data.profile,
        todayAppointmentsCount: result.data.todayAppointmentsCount,
        activeClientsCount: result.data.activeClientsCount,
        pendingServicesCount: result.data.pendingServicesCount,
        isLoading: false,
      });

      return result.data;
    } catch (error) {
      set({
        isLoading: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminDashboard.loadError),
      });
      return null;
    }
  },

  reset: () => set(initialState),
}));

export { useAdminProfileStore, type AdminProfileStore };
