"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsEmptyState,
  DsLoadingState,
  DsPagination,
  DsAppointmentRow,
  DsAppointmentTableHeader,
} from "@/design-system";
import { useAdminAppointmentsStore, PAGE_SIZE } from "@/stores/admin-appointments-store";
import {
  getStatusLabel,
  getStatusVariant,
  getStatusIcon,
  getRecurrenceLabel,
  formatAppointmentDate,
  formatDurationTime,
} from "@/lib/appointment-labels";

function AppointmentsTable() {
  const router = useRouter();
  const { appointments, total, page, isLoading, setPage } = useAdminAppointmentsStore();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (isLoading) {
    return <DsLoadingState message="Carregando agendamentos..." />;
  }

  if (appointments.length === 0) {
    return (
      <DsEmptyState
        title="Nenhuma limpeza agendada "
        message="Agendar limpeza manualmente agora mesmo."
        actionLabel="Agendar serviço manualmente"
        actionIcon={PlusIcon}
        onAction={() => router.push("/admin/agendamentos/novo")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-0 rounded-[10px] bg-nova-gray-50 p-6">
      <DsAppointmentTableHeader />

      <div className="flex flex-col gap-2">
        {appointments.map((appointment) => (
          <DsAppointmentRow
            key={appointment.id}
            date={formatAppointmentDate(appointment.date)}
            serviceName={appointment.service.name}
            durationTime={formatDurationTime(appointment.duration, appointment.startTime)}
            employeeName={appointment.employee?.name ?? "—"}
            statusLabel={getStatusLabel(appointment.status)}
            statusVariant={getStatusVariant(appointment.status)}
            statusIcon={getStatusIcon(appointment.status)}
            packageLabel={getRecurrenceLabel(appointment.recurrenceType)}
          />
        ))}
      </div>

      <DsPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

export { AppointmentsTable };
