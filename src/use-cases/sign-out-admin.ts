import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useToastStore } from "@/stores/toast-store";

function signOutAdmin(): void {
  useAuthStore.getState().reset();
  useSidebarStore.getState().setCollapsed(false);
  useToastStore.getState().reset();
}

export { signOutAdmin };
