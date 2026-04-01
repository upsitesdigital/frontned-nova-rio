"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  BroomIcon,
  ScrollIcon,
  ClockIcon,
  TimerIcon,
  FloppyDiskIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  DsButton,
  DsConfirmDialog,
  DsDialog,
  DsEmptyState,
  DsFormField,
  DsIcon,
  DsLoadingState,
  DsPagination,
  DsAppointmentRow,
  DsAppointmentTableHeader,
  DsSchedulePopup,
  DsSelect,
  DsSheet,
  DsStatusPill,
  DsSwitch,
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

function parseDateStringToLocalDate(value: string): Date | undefined {
  if (!value) return undefined;

  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return undefined;

  const parsedDate = new Date(year, month - 1, day);
  if (Number.isNaN(parsedDate.getTime())) return undefined;

  return parsedDate;
}

function formatDateToApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeTimeValue(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function formatDrawerDateLabel(value: string): string {
  const date = parseDateStringToLocalDate(value);
  if (!date) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const now = new Date();
  const isToday =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear();

  return isToday ? `Hoje, ${day}/${month}` : `${day}/${month}`;
}

function formatHourLabel(value: string): string {
  const normalized = normalizeTimeValue(value);
  const [hour] = normalized.split(":");
  return hour ? `${hour} Horas` : "-";
}

function formatTimestamp(value: string | null | undefined): string {
  if (!value) return "-";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsedDate);
}

function AppointmentsTable() {
  const router = useRouter();
  const {
    appointments,
    total,
    page,
    isLoading,
    setPage,
    employeeOptions,
    loadAppointments,
  } = useAdminAppointmentsStore();

  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointmentItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [editClientId, setEditClientId] = useState("");
  const [editEmployeeId, setEditEmployeeId] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const employeeSelectOptions = employeeOptions.map((employee) => ({
    value: String(employee.id),
    label: employee.name,
  }));

  const clientSelectOptions = Array.from(
    new Map(
      appointments.map((appointment) => [
        String(appointment.client.id),
        {
          value: String(appointment.client.id),
          label: appointment.client.name,
        },
      ]),
    ).values(),
  );

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
    setEditClientId(String(appointment.client.id));
    setEditEmployeeId(appointment.employee ? String(appointment.employee.id) : "");
    setRescheduleDate(appointment.date);
    setRescheduleTime(normalizeTimeValue(appointment.startTime));
    resetActionError();
    setEditOpen(true);
  }

  async function refreshAppointmentsWithSuccess(message: string) {
    await loadAppointments();
    useToastStore.getState().showToast(message, "success");
  }

  async function handleSaveEdit() {
    if (!selectedAppointment) return;

    const nextEmployeeId = editEmployeeId ? Number(editEmployeeId) : undefined;
    const currentEmployeeId = selectedAppointment.employee?.id;

    if (currentEmployeeId === nextEmployeeId) {
      setEditOpen(false);
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    const result = await saveAdminAppointment({
      id: selectedAppointment.id,
      employeeId: nextEmployeeId,
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
            <span className="font-medium text-black">E-mail:</span>{" "}
            {selectedAppointment?.client.email ?? "-"}
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
            <span className="font-medium text-black">Unidade:</span>{" "}
            {selectedAppointment?.unit?.name ?? "Nao vinculado"}
          </p>
          <p>
            <span className="font-medium text-black">Status:</span>{" "}
            {selectedAppointment ? getStatusLabel(selectedAppointment.status) : "-"}
          </p>
          <p>
            <span className="font-medium text-black">Tipo:</span>{" "}
            {selectedAppointment ? getRecurrenceLabel(selectedAppointment.recurrenceType) : "-"}
          </p>
          <p>
            <span className="font-medium text-black">Pacote:</span>{" "}
            {selectedAppointment?.package?.name ?? "Nao vinculado"}
          </p>
          <p className="col-span-2">
            <span className="font-medium text-black">CEP:</span>{" "}
            {selectedAppointment?.locationZip ?? "Nao informado"}
          </p>
          <p className="col-span-2">
            <span className="font-medium text-black">Endereco:</span>{" "}
            {selectedAppointment?.locationAddress ?? "Nao informado"}
          </p>
          <p className="col-span-2">
            <span className="font-medium text-black">Observacoes:</span>{" "}
            {selectedAppointment?.notes ?? "Sem observacoes"}
          </p>
          <p>
            <span className="font-medium text-black">Criado em:</span>{" "}
            {formatTimestamp(selectedAppointment?.createdAt)}
          </p>
          <p>
            <span className="font-medium text-black">Atualizado em:</span>{" "}
            {formatTimestamp(selectedAppointment?.updatedAt)}
          </p>
          <p className="col-span-2">
            <span className="font-medium text-black">ID:</span> {selectedAppointment?.uuid ?? "-"}
          </p>
        </div>
      </DsDialog>

      <DsSheet
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            resetActionError();
            setRescheduleOpen(false);
          }
        }}
        side="right"
        title="Editar agendamento"
        description="Visualize e edite as informacoes do agendamento."
        className="w-full max-w-140 overflow-y-auto p-0 sm:max-w-140"
      >
        <div className="flex h-full flex-col gap-6 p-6 pt-0">
          <div className="rounded-2xl border border-nova-gray-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-nova-primary/10">
                  <DsIcon icon={BroomIcon} size="md" className="text-nova-primary" />
                </span>
                <div className="flex flex-col">
                  <p className="text-xl font-medium leading-[1.3] tracking-[-0.8px] text-black">
                    {selectedAppointment?.service.name ?? "-"}
                  </p>
                  <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-600">
                    {selectedAppointment
                      ? getRecurrenceLabel(selectedAppointment.recurrenceType)
                      : "-"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-nova-gray-300 px-3 py-1.5 text-sm leading-[1.3] tracking-[-0.56px] text-nova-gray-700"
              >
                Recibo
                <DsIcon icon={ScrollIcon} size="sm" className="text-nova-primary" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[28px] font-medium leading-[1.2] tracking-[-1.12px] text-black">
                {selectedAppointment ? formatDrawerDateLabel(selectedAppointment.date) : "-"}
              </p>
              {selectedAppointment && (
                <DsStatusPill
                  icon={getStatusIcon(selectedAppointment.status)}
                  label={getStatusLabel(selectedAppointment.status)}
                  variant={getStatusVariant(selectedAppointment.status)}
                  className="text-sm"
                />
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl bg-nova-gray-50 px-4 py-3">
                <DsIcon icon={ClockIcon} size="sm" className="text-nova-primary" />
                <div className="flex flex-col">
                  <span className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-500">
                    Horario
                  </span>
                  <span className="text-sm font-medium leading-[1.3] tracking-[-0.56px] text-black">
                    {selectedAppointment ? formatHourLabel(selectedAppointment.startTime) : "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-nova-gray-50 px-4 py-3">
                <DsIcon icon={TimerIcon} size="sm" className="text-nova-primary" />
                <div className="flex flex-col">
                  <span className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-500">
                    Duracao
                  </span>
                  <span className="text-sm font-medium leading-[1.3] tracking-[-0.56px] text-black">
                    {selectedAppointment ? `${selectedAppointment.duration} min` : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DsFormField label="Cliente">
              <DsSelect
                options={clientSelectOptions}
                value={editClientId}
                onValueChange={setEditClientId}
                placeholder="Selecione"
                disabled
              />
            </DsFormField>

            <DsFormField label="Funcionario">
              <DsSelect
                options={employeeSelectOptions}
                value={editEmployeeId}
                onValueChange={setEditEmployeeId}
                placeholder="Selecione"
                disabled={isSubmitting || selectedAppointment?.status !== "SCHEDULED"}
              />
            </DsFormField>
          </div>

          <div className="rounded-2xl border border-nova-gray-100 bg-white p-4">
            <p className="text-sm font-medium leading-[1.3] tracking-[-0.56px] text-black">
              Acoes do agendamento
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <DsButton
                variant="soft"
                className="h-11 rounded-xl"
                disabled={isSubmitting || selectedAppointment?.status !== "SCHEDULED"}
                onClick={() => setRescheduleOpen(true)}
              >
                Reagendar
              </DsButton>

              <DsButton
                variant="outline"
                className="h-11 rounded-xl border-nova-gray-300 shadow-none"
                disabled={isSubmitting || selectedAppointment?.status !== "SCHEDULED"}
                onClick={() => setCancelOpen(true)}
              >
                Cancelar
              </DsButton>

              <div className="flex h-11 items-center justify-between rounded-xl border border-nova-gray-300 px-3">
                <span className="text-sm leading-[1.3] tracking-[-0.56px] text-nova-gray-700">
                  Concluido
                </span>
                <DsSwitch
                  checked={selectedAppointment?.status === "COMPLETED"}
                  disabled={isSubmitting || selectedAppointment?.status !== "SCHEDULED"}
                  onCheckedChange={(checked) => {
                    if (checked) setCompleteOpen(true);
                  }}
                />
              </div>
            </div>

            <p className="mt-3 text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-500">
              Cancelamento com 1h de antecedencia.
            </p>
          </div>

          {actionError && <p className="text-sm text-nova-error">{actionError}</p>}

          <div className="mt-auto border-t border-nova-gray-100 pt-4">
            <DsButton
              onClick={handleSaveEdit}
              disabled={isSubmitting || selectedAppointment?.status !== "SCHEDULED"}
              className="h-12 w-full rounded-xl text-base"
            >
              <DsIcon icon={FloppyDiskIcon} size="md" className="text-white" />
              {isSubmitting ? "Salvando..." : "Salvar alteracoes"}
            </DsButton>
          </div>
        </div>
      </DsSheet>

      <DsSchedulePopup
        open={rescheduleOpen}
        title="Remarcar agendamento"
        date={parseDateStringToLocalDate(rescheduleDate)}
        time={rescheduleTime}
        onDateChange={(date) => setRescheduleDate(date ? formatDateToApi(date) : "")}
        onTimeChange={setRescheduleTime}
        onCancel={() => {
          setRescheduleOpen(false);
          resetActionError();
        }}
        onClose={() => {
          setRescheduleOpen(false);
          resetActionError();
        }}
        onConfirm={handleReschedule}
        cancelLabel="Voltar"
        confirmLabel={isSubmitting ? "Remarcando..." : "Confirmar remarcacao"}
        className="w-full max-w-160"
      />

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
