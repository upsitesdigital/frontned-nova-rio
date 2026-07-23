"use client";

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
  DsAppointmentCard,
  DsAppointmentTabletCard,
  DsAppointmentTableHeader,
  DsSchedulePopup,
  DsSelect,
  DsSheet,
  DsStatusPill,
  DsSwitch,
} from "@/design-system";
import { useAdminAppointmentsStore, pageSize } from "@/stores/admin/admin-appointments-store";
import { AppointmentLabels } from "@/lib/display/appointment-labels";
import { AppointmentDateTimeFormat } from "@/lib/display/appointment-datetime-format";
import { DownloadReceipt } from "@/use-cases/client-cards/download-receipt";
import { useToastStore } from "@/stores/ui/toast-store";

export function AppointmentsTable() {
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);
  const {
    appointments,
    total,
    page,
    isLoading,
    setPage,
    employeeOptions,
    selectedAppointment,
    viewOpen,
    editOpen,
    rescheduleOpen,
    cancelOpen,
    completeOpen,
    editClientId,
    editEmployeeId,
    rescheduleDate,
    rescheduleTime,
    actionError,
    isSubmitting,
    setViewOpen,
    setEditOpen,
    setRescheduleOpen,
    setCancelOpen,
    setCompleteOpen,
    setEditClientId,
    setEditEmployeeId,
    setRescheduleDate,
    setRescheduleTime,
    resetActionError,
    openViewDialog,
    openEditDialog,
    saveEdit,
    reschedule,
    cancelAppointment,
    completeAppointment,
  } = useAdminAppointmentsStore();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
    <div className="flex flex-col gap-0 rounded-[10px] bg-nova-gray-50 p-4 sm:p-6">
      <div className="hidden lg:block">
        <DsAppointmentTableHeader
          columns={[
            { label: "Data" },
            { label: "Serviço" },
            { label: "Duração/ Horário" },
            { label: "Funcionário" },
            { label: "Status" },
            { label: "Pacote" },
            { label: "Ações", align: "right" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        {appointments.map((appointment) => {
          const view = () => openViewDialog(appointment);
          const edit =
            appointment.status === "SCHEDULED" ? () => openEditDialog(appointment) : undefined;
          const date = AppointmentLabels.formatAppointmentDate(appointment.date);
          const durationTime = AppointmentLabels.formatDurationTime(
            appointment.duration,
            appointment.startTime,
          );
          const employeeName = appointment.employee?.name ?? "—";
          const statusLabel = AppointmentLabels.getStatusLabel(appointment.status);
          const statusVariant = AppointmentLabels.getStatusVariant(appointment.status);
          const statusIcon = AppointmentLabels.getStatusIcon(appointment.status);
          const packageLabel = AppointmentLabels.getRecurrenceLabel(appointment.recurrenceType);

          return (
            <div key={appointment.id}>
              <DsAppointmentRow
                className="hidden lg:flex"
                date={date}
                serviceName={appointment.service.name}
                durationTime={durationTime}
                employeeName={employeeName}
                statusLabel={statusLabel}
                statusVariant={statusVariant}
                statusIcon={statusIcon}
                packageLabel={packageLabel}
                onView={view}
                onEdit={edit}
              />
              <DsAppointmentTabletCard
                className="hidden sm:flex lg:hidden"
                viewLabel="Visualizar"
                editLabel="Editar"
                date={date}
                serviceName={appointment.service.name}
                durationTime={durationTime}
                employeeName={employeeName}
                statusLabel={statusLabel}
                statusVariant={statusVariant}
                statusIcon={statusIcon}
                packageLabel={packageLabel}
                onView={view}
                onEdit={edit}
              />
              <DsAppointmentCard
                className="sm:hidden"
                viewLabel="Visualizar"
                editLabel="Editar"
                date={date}
                serviceName={appointment.service.name}
                durationTime={durationTime}
                employeeName={employeeName}
                statusLabel={statusLabel}
                statusVariant={statusVariant}
                statusIcon={statusIcon}
                packageLabel={packageLabel}
                onView={view}
                onEdit={edit}
              />
            </div>
          );
        })}
      </div>

      <DsPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
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
            {selectedAppointment
              ? AppointmentLabels.formatAppointmentDate(selectedAppointment.date)
              : "-"}
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
            {selectedAppointment
              ? AppointmentLabels.getStatusLabel(selectedAppointment.status)
              : "-"}
          </p>
          <p>
            <span className="font-medium text-black">Tipo:</span>{" "}
            {selectedAppointment
              ? AppointmentLabels.getRecurrenceLabelWithFrequency(
                  selectedAppointment.recurrenceType,
                  selectedAppointment.weeklyFrequency,
                )
              : "-"}
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
            {AppointmentDateTimeFormat.formatTimestamp(selectedAppointment?.createdAt)}
          </p>
          <p>
            <span className="font-medium text-black">Atualizado em:</span>{" "}
            {AppointmentDateTimeFormat.formatTimestamp(selectedAppointment?.updatedAt)}
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
                      ? AppointmentLabels.getRecurrenceLabel(selectedAppointment.recurrenceType)
                      : "-"}
                  </p>
                </div>
              </div>

              <DsButton
                variant="outline"
                disabled={selectedAppointment?.payment?.status !== "APPROVED"}
                onClick={() => {
                  const paymentId = selectedAppointment?.payment?.id;
                  if (!paymentId) return;
                  DownloadReceipt.downloadReceipt(paymentId).catch(() =>
                    showToast("Erro ao baixar recibo. Tente novamente.", "error"),
                  );
                }}
                className="inline-flex items-center gap-2 rounded-full border border-nova-gray-300 px-3 py-1.5 text-sm leading-[1.3] tracking-[-0.56px] text-nova-gray-700"
              >
                Recibo
                <DsIcon icon={ScrollIcon} size="sm" className="text-nova-primary" />
              </DsButton>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[28px] font-medium leading-[1.2] tracking-[-1.12px] text-black">
                {selectedAppointment
                  ? AppointmentDateTimeFormat.formatDrawerDateLabel(selectedAppointment.date)
                  : "-"}
              </p>
              {selectedAppointment && (
                <DsStatusPill
                  icon={AppointmentLabels.getStatusIcon(selectedAppointment.status)}
                  label={AppointmentLabels.getStatusLabel(selectedAppointment.status)}
                  variant={AppointmentLabels.getStatusVariant(selectedAppointment.status)}
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
                    {selectedAppointment
                      ? AppointmentDateTimeFormat.formatHourLabel(selectedAppointment.startTime)
                      : "-"}
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
              onClick={saveEdit}
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
        closeLabel="Fechar"
        open={rescheduleOpen}
        title="Remarcar agendamento"
        date={AppointmentDateTimeFormat.parseDateStringToLocalDate(rescheduleDate)}
        time={rescheduleTime}
        onDateChange={(date) =>
          setRescheduleDate(date ? AppointmentDateTimeFormat.formatDateToApi(date) : "")
        }
        onTimeChange={setRescheduleTime}
        onCancel={() => {
          setRescheduleOpen(false);
          resetActionError();
        }}
        onClose={() => {
          setRescheduleOpen(false);
          resetActionError();
        }}
        onConfirm={reschedule}
        cancelLabel="Voltar"
        confirmLabel={isSubmitting ? "Remarcando..." : "Confirmar remarcacao"}
        confirmDisabled={isSubmitting}
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
        onConfirm={cancelAppointment}
      />

      <DsConfirmDialog
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        title="Concluir agendamento"
        description="Confirma que o servico foi executado e deve ser marcado como concluido?"
        confirmLabel={isSubmitting ? "Concluindo..." : "Sim, concluir"}
        cancelLabel="Voltar"
        onConfirm={completeAppointment}
      />
    </div>
  );
}
