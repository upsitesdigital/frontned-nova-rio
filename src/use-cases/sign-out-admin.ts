import { useAuthStore } from "@/stores/auth-store";
import { useAdminProfileStore } from "@/stores/admin-profile-store";
import { useAdminAgendaStore } from "@/stores/admin-agenda-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useToastStore } from "@/stores/toast-store";

function signOutAdmin(): void {
  useAuthStore.getState().reset();
  useAdminProfileStore.getState().reset();
  useAdminAgendaStore.getState().reset();
  useSidebarStore.getState().setCollapsed(false);
  useToastStore.getState().reset();
}

export { signOutAdmin };
