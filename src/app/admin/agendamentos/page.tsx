"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { DsButton, DsIcon } from "@/design-system";
import { useAdminAppointmentsStore } from "@/stores/admin-appointments-store";
import { waitForAuthHydration } from "@/stores/auth-store";
import { AppointmentsFilterBar } from "./_components/appointments-filter-bar";
import { AppointmentsTable } from "./_components/appointments-table";

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const { error, loadAppointments, loadFilterOptions } = useAdminAppointmentsStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      loadAppointments();
      loadFilterOptions();
    });
  }, [loadAppointments, loadFilterOptions]);

  if (error) {
    return (
      <div className="flex items-center justify-center py-20" role="alert">
        <p className="text-base text-nova-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-semibold leading-[1.3] tracking-[-1.92px] text-black">
            Agendamentos
          </h1>
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            Visão geral dos serviços e agendamentos.
          </p>
        </div>
        <DsButton
          variant="default"
          onClick={() => router.push("/admin/agendamentos/novo")}
          className="flex h-14 w-68 items-center justify-center gap-1 rounded-xl bg-nova-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white hover:bg-nova-primary/90"
        >
          <DsIcon icon={PlusIcon} size="lg" className="text-white" />
          Agendar serviço
        </DsButton>
      </div>

      <div className="flex flex-col gap-6 overflow-clip rounded-4xl border border-nova-gray-100 bg-white px-6 py-8">
        <AppointmentsFilterBar />
        <AppointmentsTable />
      </div>
    </div>
  );
}
