import { useAuthStore } from "@/stores/auth/auth-store";
import { useAdminProfileStore } from "@/stores/admin/admin-profile-store";
import { useAdminAgendaStore } from "@/stores/admin/admin-agenda-store";
import { useSidebarStore } from "@/stores/ui/sidebar-store";
import { useToastStore } from "@/stores/ui/toast-store";

function signOutAdmin(): void {
  useAuthStore.getState().reset();
  useAdminProfileStore.getState().reset();
  useAdminAgendaStore.getState().reset();
  useSidebarStore.getState().setCollapsed(false);
  useToastStore.getState().reset();
}

export { signOutAdmin };
