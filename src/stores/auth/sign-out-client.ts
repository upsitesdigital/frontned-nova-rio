import { useAuthStore } from "@/stores/auth/auth-store";
import { useCardsStore } from "@/stores/client/cards-store";
import { useDashboardStore } from "@/stores/client/dashboard-store";
import { useDashboardPaymentsStore } from "@/stores/client/dashboard-payments-store";
import { useDeleteAccountStore } from "@/stores/client/delete-account-store";
import { useEmailChangeStore } from "@/stores/client/email-change-store";
import { usePasswordChangeStore } from "@/stores/client/password-change-store";
import { usePaymentsPageStore } from "@/stores/client/payments-page-store";
import { useProfileInfoStore } from "@/stores/client/profile-info-store";
import { useServiceEditStore } from "@/stores/client/service-edit-store";
import { useServicesHistoryStore } from "@/stores/client/services-history-store";
import { useSidePanelRescheduleStore } from "@/stores/client/side-panel-reschedule-store";
import { useSidebarStore } from "@/stores/ui/sidebar-store";
import { useToastStore } from "@/stores/ui/toast-store";

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
