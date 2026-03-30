import { completeAdminAppointment } from "@/api/admin-appointments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface CompleteAdminAppointmentResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function completeAppointment(appointmentId: number): Promise<CompleteAdminAppointmentResult> {
  try {
    await completeAdminAppointment(appointmentId);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminAppointments.completeError),
      isAuthError: isAuthError(error),
    };
  }
}

export { completeAppointment, type CompleteAdminAppointmentResult };
