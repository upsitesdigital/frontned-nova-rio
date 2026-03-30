"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsButton,
  DsConfirmDialog,
  DsDialog,
  DsEmptyState,
  DsFormField,
  DsInput,
  DsLoadingState,
  DsPagination,
  DsAppointmentRow,
  DsAppointmentTableHeader,
  DsSelect,
  DsTextarea,
} from "@/design-system";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { useAdminAppointmentsStore, PAGE_SIZE } from "@/stores/admin-appointments-store";
import { cancelAppointment } from "@/use-cases/cancel-admin-appointment";
import { completeAppointment } from "@/use-cases/complete-admin-appointment";
import { rescheduleAppointment } from "@/use-cases/reschedule-admin-appointment";
import { saveAdminAppointment } from "@/use-cases/update-admin-appointment";
import type { AdminAppointmentItem } from "@/api/admin-appointments-api";
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
  const {
    appointments,
    total,
    page,
    isLoading,
    setPage,
    employeeOptions,
    serviceOptions,
    loadAppointments,
  } = useAdminAppointmentsStore();

  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointmentItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [editDuration, setEditDuration] = useState("");
  const [editEmployeeId, setEditEmployeeId] = useState("");
  const [editServiceId, setEditServiceId] = useState("");
  const [editLocationZip, setEditLocationZip] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const employeeSelectOptions = employeeOptions.map((employee) => ({
    value: String(employee.id),
    label: employee.name,
  }));

  const serviceSelectOptions = serviceOptions.map((service) => ({
    value: String(service.id),
    label: service.name,
  }));

  function resetActionError() {
    setActionError(null);
  }

  function openViewDialog(appointment: AdminAppointmentItem) {
    setSelectedAppointment(appointment);
    resetActionError();
    setViewOpen(true);
  }

  function openEditDialog(appointment: AdminAppointmentItem) {
    setSelectedAppointment(appointment);
    setEditDuration(String(appointment.duration));
    setEditEmployeeId(appointment.employee ? String(appointment.employee.id) : "");
    setEditServiceId(String(appointment.service.id));
    setEditLocationZip(appointment.locationZip ?? "");
    setEditNotes(appointment.notes ?? "");
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.startTime);
    resetActionError();
    setEditOpen(true);
  }

  async function refreshAppointmentsWithSuccess(message: string) {
    await loadAppointments();
    useToastStore.getState().showToast(message, "success");
  }

  async function handleSaveEdit() {
    if (!selectedAppointment) return;

    const parsedDuration = Number(editDuration);
    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      setActionError("Informe uma duracao valida em minutos.");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    const result = await saveAdminAppointment({
      id: selectedAppointment.id,
      duration: parsedDuration,
      employeeId: editEmployeeId ? Number(editEmployeeId) : undefined,
      serviceId: editServiceId ? Number(editServiceId) : undefined,
      locationZip: editLocationZip.trim() || undefined,
      notes: editNotes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setActionError(result.error ?? MESSAGES.adminAppointments.updateError);
      return;
    }

    setEditOpen(false);
    await refreshAppointmentsWithSuccess(MESSAGES.adminAppointments.updateSuccess);
  }

  async function handleReschedule() {
    if (!selectedAppointment) return;

    if (!rescheduleDate || !rescheduleTime) {
      setActionError("Informe a nova data e o novo horario.");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    const result = await rescheduleAppointment({
      id: selectedAppointment.id,
      date: rescheduleDate,
      startTime: rescheduleTime,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setActionError(result.error ?? MESSAGES.adminAppointments.rescheduleError);
      return;
    }

    setRescheduleOpen(false);
    setEditOpen(false);
    await refreshAppointmentsWithSuccess(MESSAGES.adminAppointments.rescheduleSuccess);
  }

  async function handleCancelAppointment() {
    if (!selectedAppointment) return;

    setIsSubmitting(true);
    setActionError(null);
    const result = await cancelAppointment(selectedAppointment.id);
    setIsSubmitting(false);

    if (!result.success) {
      setActionError(result.error ?? MESSAGES.adminAppointments.cancelError);
      return;
    }

    setCancelOpen(false);
    setEditOpen(false);
    await refreshAppointmentsWithSuccess(MESSAGES.adminAppointments.cancelSuccess);
  }

  async function handleCompleteAppointment() {
    if (!selectedAppointment) return;

    setIsSubmitting(true);
    setActionError(null);
    const result = await completeAppointment(selectedAppointment.id);
    setIsSubmitting(false);

    if (!result.success) {
      setActionError(result.error ?? MESSAGES.adminAppointments.completeError);
      return;
    }

    setCompleteOpen(false);
    setEditOpen(false);
    await refreshAppointmentsWithSuccess(MESSAGES.adminAppointments.completeSuccess);
  }

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
            onView={() => openViewDialog(appointment)}
            onEdit={
              appointment.status === "SCHEDULED" ? () => openEditDialog(appointment) : undefined
            }
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

      <DsDialog
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) resetActionError();
        }}
        title="Detalhes do agendamento"
        description="Informacoes principais do servico selecionado."
      >
        <div className="grid grid-cols-2 gap-4 text-sm text-nova-gray-700">
          <p>
            <span className="font-medium text-black">Cliente:</span>{" "}
            {selectedAppointment?.client.name ?? "-"}
          </p>
          <p>
            <span className="font-medium text-black">Servico:</span>{" "}
            {selectedAppointment?.service.name ?? "-"}
          </p>
          <p>
            <span className="font-medium text-black">Data:</span>{" "}
            {selectedAppointment ? formatAppointmentDate(selectedAppointment.date) : "-"}
          </p>
          <p>
            <span className="font-medium text-black">Horario:</span>{" "}
            {selectedAppointment?.startTime ?? "-"}
          </p>
          <p>
            <span className="font-medium text-black">Duracao:</span>{" "}
            {selectedAppointment?.duration ?? "-"} min
          </p>
          <p>
            <span className="font-medium text-black">Funcionario:</span>{" "}
            {selectedAppointment?.employee?.name ?? "Nao vinculado"}
          </p>
          <p>
            <span className="font-medium text-black">Status:</span>{" "}
            {selectedAppointment ? getStatusLabel(selectedAppointment.status) : "-"}
          </p>
          <p>
            <span className="font-medium text-black">Tipo:</span>{" "}
            {selectedAppointment ? getRecurrenceLabel(selectedAppointment.recurrenceType) : "-"}
          </p>
          <p className="col-span-2">
            <span className="font-medium text-black">CEP:</span>{" "}
            {selectedAppointment?.locationZip ?? "Nao informado"}
          </p>
          <p className="col-span-2">
            <span className="font-medium text-black">Observacoes:</span>{" "}
            {selectedAppointment?.notes ?? "Sem observacoes"}
          </p>
        </div>
      </DsDialog>

      <DsDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) resetActionError();
        }}
        title="Editar agendamento"
        description="Atualize os dados do servico e aplique as acoes do ciclo de vida."
        footer={
          <div className="flex w-full flex-wrap items-center justify-end gap-2">
            <DsButton variant="outline" onClick={() => setRescheduleOpen(true)}>
              Remarcar
            </DsButton>
            <DsButton variant="destructive" onClick={() => setCancelOpen(true)}>
              Cancelar
            </DsButton>
            <DsButton variant="secondary" onClick={() => setCompleteOpen(true)}>
              Concluir
            </DsButton>
            <DsButton onClick={handleSaveEdit} disabled={isSubmitting}>
              Salvar alteracoes
            </DsButton>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <DsFormField label="Duracao (min)">
            <DsInput
              type="number"
              min={30}
              step={30}
              value={editDuration}
              onChange={(event) => setEditDuration(event.target.value)}
            />
          </DsFormField>

          <DsFormField label="Funcionario">
            <DsSelect
              options={employeeSelectOptions}
              value={editEmployeeId}
              onValueChange={setEditEmployeeId}
              placeholder="Selecione"
            />
          </DsFormField>

          <DsFormField label="Servico">
            <DsSelect
              options={serviceSelectOptions}
              value={editServiceId}
              onValueChange={setEditServiceId}
              placeholder="Selecione"
            />
          </DsFormField>

          <DsFormField label="CEP">
            <DsInput
              value={editLocationZip}
              onChange={(event) => setEditLocationZip(event.target.value)}
              placeholder="00000-000"
            />
          </DsFormField>

          <DsFormField label="Observacoes" className="col-span-2">
            <DsTextarea
              value={editNotes}
              onChange={(event) => setEditNotes(event.target.value)}
              placeholder="Detalhes adicionais para o time"
            />
          </DsFormField>
        </div>

        {actionError && <p className="text-sm text-nova-error">{actionError}</p>}
      </DsDialog>

      <DsDialog
        open={rescheduleOpen}
        onOpenChange={(open) => {
          setRescheduleOpen(open);
          if (!open) resetActionError();
        }}
        title="Remarcar agendamento"
        description="Defina nova data e horario para o agendamento selecionado."
        footer={
          <DsButton onClick={handleReschedule} disabled={isSubmitting}>
            Confirmar remarcacao
          </DsButton>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <DsFormField label="Nova data">
            <DsInput
              type="date"
              value={rescheduleDate}
              onChange={(event) => setRescheduleDate(event.target.value)}
            />
          </DsFormField>
          <DsFormField label="Novo horario">
            <DsInput
              type="time"
              value={rescheduleTime}
              onChange={(event) => setRescheduleTime(event.target.value)}
            />
          </DsFormField>
        </div>

        {actionError && <p className="text-sm text-nova-error">{actionError}</p>}
      </DsDialog>

      <DsConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancelar agendamento"
        description="Tem certeza que deseja cancelar este agendamento? Esta acao nao pode ser desfeita."
        confirmLabel={isSubmitting ? "Cancelando..." : "Sim, cancelar"}
        cancelLabel="Voltar"
        variant="destructive"
        onConfirm={handleCancelAppointment}
      />

      <DsConfirmDialog
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        title="Concluir agendamento"
        description="Confirma que o servico foi executado e deve ser marcado como concluido?"
        confirmLabel={isSubmitting ? "Concluindo..." : "Sim, concluir"}
        cancelLabel="Voltar"
        onConfirm={handleCompleteAppointment}
      />
    </div>
  );
}

export { AppointmentsTable };
