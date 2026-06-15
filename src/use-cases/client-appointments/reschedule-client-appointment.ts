import { format } from "date-fns";

import { AppointmentsApi } from "@/api/client/appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

interface RescheduleAppointmentParams {
  appointmentId: number;
  date: Date;
  time: string;
}

interface AppointmentActionResult {
  success: boolean;
  error: string | null;
}

class RescheduleClientAppointment {
  static async rescheduleClientAppointment(
    params: RescheduleAppointmentParams,
  ): Promise<AppointmentActionResult> {
    try {
      await AppointmentsApi.rescheduleAppointment(params.appointmentId, {
        date: format(params.date, "yyyy-MM-dd"),
        startTime: params.time,
      });
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: AuthHelpers.resolveErrorMessage(error, Messages.appointments.rescheduleError),
      };
    }
  }
}

export {
  RescheduleClientAppointment,
  type RescheduleAppointmentParams,
  type AppointmentActionResult,
};
