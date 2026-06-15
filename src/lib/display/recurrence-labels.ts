import { AppointmentLabels } from "@/lib/display/appointment-labels";

class RecurrenceLabels {
  /** @deprecated Use AppointmentLabels.getRecurrenceLabel instead */
  static resolveRecurrenceLabel(recurrenceType: string): string {
    return AppointmentLabels.getRecurrenceLabel(recurrenceType);
  }
}

export { RecurrenceLabels };
