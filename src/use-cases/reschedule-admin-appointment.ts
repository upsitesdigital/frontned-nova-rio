import { rescheduleAdminAppointment } from "@/api/admin-appointments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface RescheduleAdminAppointmentInput {
  id: number;
  date: string;
  startTime: string;
}

interface RescheduleAdminAppointmentResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function rescheduleAppointment(
  input: RescheduleAdminAppointmentInput,
): Promise<RescheduleAdminAppointmentResult> {
  try {
    await rescheduleAdminAppointment(input.id, {
      date: input.date,
      startTime: input.startTime,
    });

    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminAppointments.rescheduleError),
      isAuthError: isAuthError(error),
    };
  }
}

export {
  rescheduleAppointment,
  type RescheduleAdminAppointmentInput,
  type RescheduleAdminAppointmentResult,
};
