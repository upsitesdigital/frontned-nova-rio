import { AppointmentsApi } from "@/api/client/appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface AppointmentActionResult {
  success: boolean;
  error: string | null;
}

class CancelClientAppointment {
  static async cancelClientAppointment(appointmentId: number): Promise<AppointmentActionResult> {
    try {
      await AppointmentsApi.cancelAppointment(appointmentId);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.appointments.cancelError),
      };
    }
  }
}

export { CancelClientAppointment, type AppointmentActionResult };
