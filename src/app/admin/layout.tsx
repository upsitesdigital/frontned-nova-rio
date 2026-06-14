"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import {
  HouseIcon,
  BroomIcon,
  UsersIcon,
  UsersThreeIcon,
  MapPinIcon,
  TimerIcon,
  CalendarBlankIcon,
  CurrencyDollarSimpleIcon,
  NoteIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { DsAdminNavItem } from "@/design-system";
import { AppToastContainer } from "@/app/_components/app-toast-container";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth/auth-store";
import { useAdminProfileStore } from "@/stores/admin/admin-profile-store";
import { useAdminAgendaStore } from "@/stores/admin/admin-agenda-store";
import { useSidebarStore } from "@/stores/ui/sidebar-store";
import { SignOutAdmin } from "@/use-cases/auth/sign-out-admin";

const adminNavItems: DsAdminNavItem[] = [
  { path: "/admin", label: "Minha Área", icon: HouseIcon },
  { path: "/admin/agendamentos", label: "Agendamentos", icon: BroomIcon },
  { path: "/admin/funcionarios", label: "Funcionários", icon: UsersIcon },
  { path: "/admin/clientes", label: "Clientes", icon: UsersThreeIcon },
  { path: "/admin/pagamentos", label: "Pagamentos", icon: CurrencyDollarSimpleIcon },
  { path: "/admin/relatorios", label: "Relatórios", icon: NoteIcon },
  { path: "/admin/servicos", label: "Serviços", icon: BroomIcon },
  { path: "/admin/unidades", label: "Unidades", icon: MapPinIcon },
  { path: "/admin/pacotes", label: "Pacotes", icon: TimerIcon },
  { path: "/admin/feriados", label: "Feriados", icon: CalendarBlankIcon },
  { path: "/admin/usuarios", label: "Usuários", icon: UsersThreeIcon },
];

// Direct file import required for next/dynamic code-splitting
const DsAdminDashboardShell = dynamic(
  () =>
    import("@/design-system/composite/ds-admin-dashboard-shell").then(
      (mod) => mod.DsAdminDashboardShell,
    ),
  { ssr: false },
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, isLoading, isAuthError, loadDashboard } = useAdminProfileStore();
  const hydrateAgenda = useAdminAgendaStore((s) => s.hydrateFromDashboard);
  const userType = useAuthStore((s) => s.userType);
  const sidebarCollapsed = useSidebarStore((s) => s.collapsed);
  const setSidebarCollapsed = useSidebarStore((s) => s.setCollapsed);

  useEffect(() => {
    waitForAuthHydration().then(async () => {
      const data = await loadDashboard();
      if (data) {
        hydrateAgenda(data.agendaItems, data.agendaTotal, data.serviceOptions);
      }
    });
  }, [loadDashboard, hydrateAgenda]);

  useEffect(() => {
    if (isAuthError && !profile) {
      router.push("/login");
    } else if (userType && userType !== "admin") {
      router.push("/dashboard");
    }
  }, [isAuthError, profile, userType, router]);

  const handleSignOut = () => {
    SignOutAdmin.execute();
    router.push("/login");
  };

  if (isLoading || (!profile && !isAuthError)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-base text-nova-gray-400" role="status">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <>
      <DsAdminDashboardShell
        items={adminNavItems}
        signOutLabel="Sair"
        expandLabel="Expandir menu"
        collapseLabel="Recolher menu"
        notificationsLabel="Notificações"
        settingsLabel="Configurações"
        menuLabel="Menu do usuário"
        profileLabel="Perfil"
        accountLabel="Minha conta"
        activePath={pathname}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarCollapsedChange={setSidebarCollapsed}
        userInitials={profile?.name?.charAt(0) ?? "A"}
        notificationCount={0}
        onNavigate={(path) => router.push(path)}
        onSignOut={handleSignOut}
      >
        {children}
      </DsAdminDashboardShell>
      <AppToastContainer />
    </>
  );
}
