import { cancelAdminAppointment } from "@/api/admin-appointments-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface CancelAdminAppointmentResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

async function cancelAppointment(appointmentId: number): Promise<CancelAdminAppointmentResult> {
  try {
    await cancelAdminAppointment(appointmentId);
    return { success: true, error: null, isAuthError: false };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.adminAppointments.cancelError),
      isAuthError: isAuthError(error),
    };
  }
}

export { cancelAppointment, type CancelAdminAppointmentResult };
