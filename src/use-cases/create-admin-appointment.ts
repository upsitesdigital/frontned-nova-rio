import { createAdminAppointment } from "@/api/admin-appointments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { formatDateToISO } from "@/lib/date-helpers";
import { MESSAGES } from "@/lib/messages";

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
  if (!input.serviceId) return MESSAGES.adminAppointments.requiredService;
  if (!input.clientId) return MESSAGES.adminAppointments.requiredClient;
  if (!input.selectedDate) return MESSAGES.adminAppointments.requiredDate;
  if (!input.selectedTime) return MESSAGES.adminAppointments.requiredTime;
  return null;
}

function isEmployeeConflict(error: unknown): boolean {
  if (!isAuthError(error) && error instanceof Error) {
    const hasStatus = "status" in error && (error as { status: number }).status === 400;
    const hasConflict = error.message.toLowerCase().includes("conflict");
    return hasStatus && hasConflict;
  }
  return false;
}

async function submitAdminAppointment(
  input: CreateAppointmentInput,
): Promise<CreateAppointmentResult> {
  const validationError = validateAppointmentInput(input);
  if (validationError) {
    return { type: "validation_error", message: validationError };
  }

  try {
    await createAdminAppointment({
      date: formatDateToISO(input.selectedDate!),
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
    if (isAuthError(error)) {
      return { type: "auth_error", message: MESSAGES.auth.sessionExpired };
    }

    if (isEmployeeConflict(error)) {
      return {
        type: "employee_conflict",
        message: (error as Error).message,
      };
    }

    const message = resolveErrorMessage(error, MESSAGES.adminAppointments.createError);
    return { type: "error", message };
  }
}

export {
  submitAdminAppointment,
  type RecurrenceType,
  type CreateAppointmentInput,
  type CreateAppointmentResult,
};
