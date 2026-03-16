import { format, parseISO, isValid } from "date-fns";
import { CheckIcon, HourglassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import type { DsIconComponent } from "@/design-system/media";
import type { DsStatusPillVariant } from "@/design-system";

type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
type RecurrenceType = "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: "Agendado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const STATUS_VARIANTS: Record<AppointmentStatus, DsStatusPillVariant> = {
  SCHEDULED: "pending",
  COMPLETED: "approved",
  CANCELLED: "cancelled",
};

const STATUS_ICONS: Record<AppointmentStatus, DsIconComponent> = {
  COMPLETED: CheckIcon,
  SCHEDULED: HourglassIcon,
  CANCELLED: XIcon,
};

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  SINGLE: "Avulso",
  PACKAGE: "Pacote",
  WEEKLY: "Recorrência Semanal",
  BIWEEKLY: "Recorrência Quinzenal",
  MONTHLY: "Recorrência Mensal",
};

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status as AppointmentStatus] ?? status;
}

function getStatusVariant(status: string): DsStatusPillVariant {
  return STATUS_VARIANTS[status as AppointmentStatus] ?? "pending";
}

function getStatusIcon(status: string): DsIconComponent {
  return STATUS_ICONS[status as AppointmentStatus] ?? HourglassIcon;
}

function getRecurrenceLabel(recurrenceType: string): string {
  return RECURRENCE_LABELS[recurrenceType as RecurrenceType] ?? recurrenceType;
}

function formatAppointmentDate(dateStr: string): string {
  const parsed = parseISO(dateStr);
  return isValid(parsed) ? format(parsed, "dd/MM/yyyy") : "--/--/----";
}

function formatDurationTime(duration: number, startTime: string): string {
  return `${duration} min | ${startTime}H`;
}

export {
  getStatusLabel,
  getStatusVariant,
  getStatusIcon,
  getRecurrenceLabel,
  formatAppointmentDate,
  formatDurationTime,
  STATUS_LABELS,
  RECURRENCE_LABELS,
  type AppointmentStatus,
  type RecurrenceType,
};
