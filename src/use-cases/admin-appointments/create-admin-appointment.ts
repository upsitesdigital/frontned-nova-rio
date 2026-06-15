import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { DateHelpers } from "@/lib/formatting/date-helpers";
import { Messages } from "@/lib/core/messages";

type RecurrenceType = "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

interface CreateAppointmentInput {
  serviceId: string;
  recurrenceType: RecurrenceType;
  duration: string;
  clientId: string;
  employeeId: string;
  locationZip: string;
  notes: string;
  selectedDate: Date | undefined;
  selectedTime: string;
}

type CreateAppointmentResult =
  | { type: "success" }
  | { type: "validation_error"; message: string }
  | { type: "employee_conflict"; message: string }
  | { type: "auth_error"; message: string }
  | { type: "error"; message: string };

function validateAppointmentInput(input: CreateAppointmentInput): string | null {
  if (!input.serviceId) return Messages.adminAppointments.requiredService;
  if (!input.clientId) return Messages.adminAppointments.requiredClient;
  if (!input.selectedDate) return Messages.adminAppointments.requiredDate;
  if (!input.selectedTime) return Messages.adminAppointments.requiredTime;
  return null;
}

function isEmployeeConflict(error: unknown): boolean {
  if (!AuthHelpers.isAuthError(error) && error instanceof Error) {
    const hasStatus = "status" in error && (error as { status: number }).status === 400;
    const hasConflict = error.message.toLowerCase().includes("conflict");
    return hasStatus && hasConflict;
  }
  return false;
}

class CreateAdminAppointment {
  static async submitAdminAppointment(
    input: CreateAppointmentInput,
  ): Promise<CreateAppointmentResult> {
    const validationError = validateAppointmentInput(input);
    if (validationError) {
      return { type: "validation_error", message: validationError };
    }

    try {
      await AdminAppointmentsApi.createAdminAppointment({
        date: DateHelpers.formatDateToISO(input.selectedDate!),
        startTime: input.selectedTime,
        duration: Number(input.duration),
        recurrenceType: input.recurrenceType,
        clientId: Number(input.clientId),
        serviceId: Number(input.serviceId),
        employeeId:
          input.employeeId && input.employeeId !== "none" ? Number(input.employeeId) : undefined,
        locationZip: input.locationZip || undefined,
        notes: input.notes || undefined,
      });

      return { type: "success" };
    } catch (error) {
      if (AuthHelpers.isAuthError(error)) {
        return { type: "auth_error", message: Messages.auth.sessionExpired };
      }

      if (isEmployeeConflict(error)) {
        return {
          type: "employee_conflict",
          message: (error as Error).message,
        };
      }

      const message = AuthHelpers.resolveErrorMessage(
        error,
        Messages.adminAppointments.createError,
      );
      return { type: "error", message };
    }
  }
}

export {
  CreateAdminAppointment,
  type RecurrenceType,
  type CreateAppointmentInput,
  type CreateAppointmentResult,
};
