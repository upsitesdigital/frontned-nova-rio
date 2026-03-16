"use client";

import { useEffect } from "react";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { DsAlert, DsButton, DsIcon, DsPageHeader } from "@/design-system";
import { useAdminEmployeesStore } from "@/stores/admin-employees-store";
import { waitForAuthHydration } from "@/stores/auth-store";
import { EmployeesFilterBar } from "./_components/employees-filter-bar";
import { EmployeesList } from "./_components/employees-list";
import { EmployeeSchedulePopup } from "./_components/employee-schedule-popup";

export default function AdminEmployeesPage() {
  const { error, loadEmployees } = useAdminEmployeesStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      loadEmployees();
    });
  }, [loadEmployees]);

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <DsAlert variant="error" title={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <DsPageHeader
        title="Equipe de funcionários"
        subtitle="Gerencie todos os funcionários cadastrados."
        action={
          <DsButton
            variant="default"
            size="flow-sm"
            className="w-68 bg-nova-primary hover:bg-nova-primary/90"
          >
            <DsIcon icon={PlusIcon} size="lg" className="text-white" />
            Novo funcionário
          </DsButton>
        }
      />

      <div className="flex flex-col gap-6 overflow-clip rounded-4xl border border-nova-gray-100 bg-white px-6 py-8">
        <EmployeesFilterBar />
        <EmployeesList />
      </div>

      <EmployeeSchedulePopup />
    </div>
  );
}
