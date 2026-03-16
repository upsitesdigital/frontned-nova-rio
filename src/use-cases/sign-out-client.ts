import { useAuthStore } from "@/stores/auth-store";
import { useCardsStore } from "@/stores/cards-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useDashboardPaymentsStore } from "@/stores/dashboard-payments-store";
import { useDeleteAccountStore } from "@/stores/delete-account-store";
import { useEmailChangeStore } from "@/stores/email-change-store";
import { usePasswordChangeStore } from "@/stores/password-change-store";
import { usePaymentsPageStore } from "@/stores/payments-page-store";
import { useProfileInfoStore } from "@/stores/profile-info-store";
import { useServiceEditStore } from "@/stores/service-edit-store";
import { useServicesHistoryStore } from "@/stores/services-history-store";
import { useSidePanelRescheduleStore } from "@/stores/side-panel-reschedule-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useToastStore } from "@/stores/toast-store";

function signOutClient(): void {
  useAuthStore.getState().reset();
  useDashboardStore.getState().reset();
  useDashboardPaymentsStore.getState().reset();
  useProfileInfoStore.getState().reset();
  useCardsStore.getState().reset();
  useEmailChangeStore.getState().reset();
  usePasswordChangeStore.getState().reset();
  useDeleteAccountStore.getState().reset();
  useServiceEditStore.getState().reset();
  useServicesHistoryStore.getState().reset();
  useSidePanelRescheduleStore.getState().reset();
  useSidebarStore.getState().setCollapsed(false);
  useToastStore.getState().reset();
  usePaymentsPageStore.getState().setFilter("ALL");
}

export { signOutClient };
