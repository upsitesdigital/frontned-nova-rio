import { cancelAppointment } from "@/api/appointments-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface AppointmentActionResult {
  success: boolean;
  error: string | null;
}

async function cancelClientAppointment(appointmentId: number): Promise<AppointmentActionResult> {
  try {
    await cancelAppointment(appointmentId);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.appointments.cancelError),
    };
  }
}

export { cancelClientAppointment, type AppointmentActionResult };
