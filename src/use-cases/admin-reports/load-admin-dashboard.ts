import { AdminDashboardApi, type AgendaItem } from "@/api/admin/admin-dashboard-api";
import { AuthApi, type AdminProfile } from "@/api/core/auth-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";
import {
  GetActiveServiceOptions,
  type ActiveServiceOption,
} from "@/use-cases/admin-services/get-active-service-options";

interface AdminDashboardData {
  profile: AdminProfile;
  todayAppointmentsCount: number;
  activeClientsCount: number;
  pendingServicesCount: number;
  agendaItems: AgendaItem[];
  agendaTotal: number;
  serviceOptions: ActiveServiceOption[];
}

interface DashboardLoadResult {
  data: AdminDashboardData | null;
  error: string | null;
  isAuthError: boolean;
}

class LoadAdminDashboard {
  static async loadAdminDashboardData(agendaPageSize: number): Promise<DashboardLoadResult> {
    const results = await Promise.allSettled([
      AuthApi.fetchAdminProfile(),
      AdminDashboardApi.fetchTodayAppointmentsCount(),
      AdminDashboardApi.fetchActiveClientsCount(),
      AdminDashboardApi.fetchPendingAppointmentsCount(),
      AdminDashboardApi.fetchTodayAgenda(1, agendaPageSize),
      GetActiveServiceOptions.getActiveServiceOptions(),
    ]);

    const [profileR, todayR, clientsR, pendingR, agendaR, servicesR] = results;

    if (profileR.status === "rejected") {
      return {
        data: null,
        error: AuthHelpers.resolveErrorMessage(profileR.reason, Messages.adminDashboard.loadError),
        isAuthError: AuthHelpers.isAuthError(profileR.reason),
      };
    }

    return {
      data: {
        profile: profileR.value,
        todayAppointmentsCount: todayR.status === "fulfilled" ? todayR.value.count : 0,
        activeClientsCount: clientsR.status === "fulfilled" ? clientsR.value.count : 0,
        pendingServicesCount: pendingR.status === "fulfilled" ? pendingR.value.count : 0,
        agendaItems: agendaR.status === "fulfilled" ? agendaR.value.items : [],
        agendaTotal: agendaR.status === "fulfilled" ? agendaR.value.total : 0,
        serviceOptions: servicesR.status === "fulfilled" ? (servicesR.value.data ?? []) : [],
      },
      error: null,
      isAuthError: false,
    };
  }
}

export { LoadAdminDashboard, type AdminDashboardData, type DashboardLoadResult };
