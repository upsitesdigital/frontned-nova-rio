import { useAuthStore } from "@/stores/auth/auth-store";
import { useAdminProfileStore } from "@/stores/admin/admin-profile-store";
import { useAdminAgendaStore } from "@/stores/admin/admin-agenda-store";
import { useAdminAppointmentsStore } from "@/stores/admin/admin-appointments-store";
import { useAdminClientsStore } from "@/stores/admin/admin-clients-store";
import { useAdminEmployeesStore } from "@/stores/admin/admin-employees-store";
import { useAdminEmployeeEditStore } from "@/stores/admin/admin-employee-edit-store";
import { useAdminEmployeeScheduleStore } from "@/stores/admin/admin-employee-schedule-store";
import { useAdminHolidaysStore } from "@/stores/admin/admin-holidays-store";
import { useAdminPackagesStore } from "@/stores/admin/admin-packages-store";
import { useAdminPaymentsStore } from "@/stores/admin/admin-payments-store";
import { useAdminReportsStore } from "@/stores/admin/admin-reports-store";
import { useAdminServicesStore } from "@/stores/admin/admin-services-store";
import { useAdminUnitsStore } from "@/stores/admin/admin-units-store";
import { useAdminUsersStore } from "@/stores/admin/admin-users-store";
import { useAdminCreateAppointmentStore } from "@/stores/admin/admin-create-appointment-store";
import { useSidebarStore } from "@/stores/ui/sidebar-store";
import { useToastStore } from "@/stores/ui/toast-store";

class SignOutAdmin {
  static execute(): void {
    useAuthStore.getState().reset();
    useAdminCreateAppointmentStore.getState().reset();
    useAdminProfileStore.getState().reset();
    useAdminAgendaStore.getState().reset();
    useAdminAppointmentsStore.getState().reset();
    useAdminClientsStore.getState().reset();
    useAdminEmployeesStore.getState().reset();
    useAdminEmployeeEditStore.getState().reset();
    useAdminEmployeeScheduleStore.getState().reset();
    useAdminHolidaysStore.getState().reset();
    useAdminPackagesStore.getState().reset();
    useAdminPaymentsStore.getState().reset();
    useAdminReportsStore.getState().reset();
    useAdminServicesStore.getState().reset();
    useAdminUnitsStore.getState().reset();
    useAdminUsersStore.getState().reset();
    useSidebarStore.getState().setCollapsed(false);
    useToastStore.getState().reset();
  }
}

export { SignOutAdmin };
