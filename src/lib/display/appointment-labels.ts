import { format, parseISO, isValid } from "date-fns";
import { CheckIcon, HourglassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import type { DsIconComponent } from "@/design-system/media";
import type { DsStatusPillVariant } from "@/design-system";

type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
type RecurrenceType = "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

class AppointmentLabels {
  static readonly statusLabels: Record<AppointmentStatus, string> = {
    SCHEDULED: "Agendado",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };

  static readonly statusVariants: Record<AppointmentStatus, DsStatusPillVariant> = {
    SCHEDULED: "pending",
    COMPLETED: "approved",
    CANCELLED: "cancelled",
  };

  static readonly statusIcons: Record<AppointmentStatus, DsIconComponent> = {
    COMPLETED: CheckIcon,
    SCHEDULED: HourglassIcon,
    CANCELLED: XIcon,
  };

  static readonly recurrenceLabels: Record<RecurrenceType, string> = {
    SINGLE: "Avulso",
    PACKAGE: "Pacote",
    WEEKLY: "Recorrência Semanal",
    BIWEEKLY: "Recorrência Quinzenal",
    MONTHLY: "Recorrência Mensal",
  };

  static getStatusLabel(status: string): string {
    return AppointmentLabels.statusLabels[status as AppointmentStatus] ?? status;
  }

  static getStatusVariant(status: string): DsStatusPillVariant {
    return AppointmentLabels.statusVariants[status as AppointmentStatus] ?? "pending";
  }

  static getStatusIcon(status: string): DsIconComponent {
    return AppointmentLabels.statusIcons[status as AppointmentStatus] ?? HourglassIcon;
  }

  static getRecurrenceLabel(recurrenceType: string): string {
    return AppointmentLabels.recurrenceLabels[recurrenceType as RecurrenceType] ?? recurrenceType;
  }

  static getRecurrenceLabelWithFrequency(recurrenceType: string, weeklyFrequency: number): string {
    const label = AppointmentLabels.getRecurrenceLabel(recurrenceType);
    if (recurrenceType === "WEEKLY" && weeklyFrequency > 1) {
      return `${label} (${weeklyFrequency}x por semana)`;
    }
    return label;
  }

  static formatAppointmentDate(dateStr: string): string {
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? format(parsed, "dd/MM/yyyy") : "--/--/----";
  }

  static formatDurationTime(duration: number, startTime: string): string {
    return `${duration} min | ${startTime}H`;
  }
}

export { AppointmentLabels, type AppointmentStatus, type RecurrenceType };
