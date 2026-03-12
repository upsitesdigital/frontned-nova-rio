"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { DsToastContainer } from "@/design-system";
import { useAuthStore } from "@/stores/auth-store";
import { useDashboardStore } from "@/stores/dashboard-store";

const DsClientDashboardShell = dynamic(
  () =>
    import("@/design-system/composite/ds-client-dashboard-shell").then(
      (mod) => mod.DsClientDashboardShell,
    ),
  { ssr: false },
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { summary, error, loadSummary } = useDashboardStore();

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (error && !summary) {
      router.push("/login");
    }
  }, [error, summary, router]);

  const handleSignOut = () => {
    useAuthStore.getState().reset();
    useDashboardStore.getState().reset();
    router.push("/login");
  };

  return (
    <>
      <DsClientDashboardShell
        activePath={pathname}
        userInitials={summary?.clientName?.charAt(0) ?? ""}
        notificationCount={0}
        onNavigate={(path) => router.push(path)}
        onScheduleService={() => router.push("/agendamento")}
        onSignOut={handleSignOut}
      >
        {children}
      </DsClientDashboardShell>
      <DsToastContainer />
    </>
  );
}
