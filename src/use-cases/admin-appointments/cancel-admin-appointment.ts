import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface CancelAdminAppointmentResult {
  success: boolean;
  error: string | null;
  isAuthError: boolean;
}

class CancelAdminAppointment {
  static async cancelAppointment(appointmentId: number): Promise<CancelAdminAppointmentResult> {
    try {
      await AdminAppointmentsApi.cancelAdminAppointment(appointmentId);
      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminAppointments.cancelError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export { CancelAdminAppointment, type CancelAdminAppointmentResult };
