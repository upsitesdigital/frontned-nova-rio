import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface CompleteAdminAppointmentResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class CompleteAdminAppointment {
  static async completeAppointment(appointmentId: number): Promise<CompleteAdminAppointmentResult> {
    try {
      await AdminAppointmentsApi.completeAdminAppointment(appointmentId);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminAppointments.completeError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { CompleteAdminAppointment, type CompleteAdminAppointmentResult };
