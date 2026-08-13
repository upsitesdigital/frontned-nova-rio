import { AdminAppointmentsApi } from "@/api/admin/admin-appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

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

class RescheduleAdminAppointment {
  static async rescheduleAppointment(
    input: RescheduleAdminAppointmentInput,
  ): Promise<RescheduleAdminAppointmentResult> {
    try {
      await AdminAppointmentsApi.rescheduleAdminAppointment(input.id, {
        date: input.date,
        startTime: input.startTime,
      });

      return { success: true, error: null, isAuthError: false };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.adminAppointments.rescheduleError),
        isAuthError: AuthHelpers.isAuthError(error),
      };
    }
  }
}

export {
  RescheduleAdminAppointment,
  type RescheduleAdminAppointmentInput,
  type RescheduleAdminAppointmentResult,
};
