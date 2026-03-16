import { create } from "zustand";

import type { AdminProfile } from "@/api/admin-dashboard-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";
import {
  loadAdminDashboardData,
  type AdminDashboardData,
} from "@/use-cases/load-admin-dashboard";
import type { ActiveServiceOption } from "@/use-cases/get-active-service-options";

const AGENDA_PAGE_SIZE = 6;

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
      const result = await loadAdminDashboardData(AGENDA_PAGE_SIZE);

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
        error: resolveErrorMessage(error, MESSAGES.adminDashboard.loadError),
      });
      return null;
    }
  },

  reset: () => set(initialState),
}));

export {
  useAdminProfileStore,
  AGENDA_PAGE_SIZE,
  type AdminProfileStore,
  type ActiveServiceOption,
};
