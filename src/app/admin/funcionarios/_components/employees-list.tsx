"use client";

import { useRouter } from "next/navigation";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr";
import { DsEmployeeInfoCard, DsEmptyState, DsSkeleton } from "@/design-system";
import { useAdminEmployeesStore } from "@/stores/admin-employees-store";
import { useAdminEmployeeScheduleStore } from "@/stores/admin-employee-schedule-store";
import {
  buildEmployeeContacts,
  buildEmployeeStatus,
  buildEmployeeDetails,
  buildEmployeeActions,
} from "@/lib/employee-card-mappers";

function EmployeesList() {
  const employees = useAdminEmployeesStore((s) => s.employees);
  const isLoading = useAdminEmployeesStore((s) => s.isLoading);
  const searchQuery = useAdminEmployeesStore((s) => s.searchQuery);
  const statusFilter = useAdminEmployeesStore((s) => s.statusFilter);
  const openSchedule = useAdminEmployeeScheduleStore((s) => s.openSchedule);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 rounded-[10px] bg-nova-gray-50 p-6">
        <DsSkeleton className="h-40 w-full rounded-[6px]" />
        <DsSkeleton className="h-40 w-full rounded-[6px]" />
        <DsSkeleton className="h-40 w-full rounded-[6px]" />
      </div>
    );
  }

  if (employees.length === 0) {
    const hasFilters = searchQuery !== "" || statusFilter !== "all";
    return (
      <DsEmptyState
        message={
          hasFilters
            ? "Nenhum funcionário encontrado para os filtros selecionados."
            : "Nenhum funcionário cadastrado."
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-[10px] bg-nova-gray-50 p-6">
      {employees.map((employee) => (
        <DsEmployeeInfoCard
          key={employee.id}
          name={employee.name}
          icon={UsersIcon}
          contacts={buildEmployeeContacts(employee.cpf, employee.phone, employee.email)}
          status={buildEmployeeStatus(employee.status)}
          details={buildEmployeeDetails(employee.availabilityFrom, employee.availabilityTo)}
          actions={buildEmployeeActions(
            () => openSchedule(employee.id, employee.name),
            () => router.push(`/admin/funcionarios/${employee.id}`),
          )}
        />
      ))}
    </div>
  );
}

export { EmployeesList };
