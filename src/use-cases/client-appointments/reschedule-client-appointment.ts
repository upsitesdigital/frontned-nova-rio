import { format } from "date-fns";

import { AppointmentsApi } from "@/api/client/appointments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";

export interface RescheduleAppointmentParams {
  appointmentId: number;
  date?: Date;
  time?: string;
  recurrenceType?: string;
  locationZip?: string;
  locationAddress?: string;
}

export interface AppointmentActionResult {
  success: boolean;
  error: string | null;
}

export class RescheduleClientAppointment {
  static async rescheduleClientAppointment(
    params: RescheduleAppointmentParams,
  ): Promise<AppointmentActionResult> {
    try {
      await AppointmentsApi.rescheduleAppointment(params.appointmentId, {
        date: params.date ? format(params.date, "yyyy-MM-dd") : undefined,
        startTime: params.time,
        recurrenceType: params.recurrenceType,
        locationZip: params.locationZip,
        locationAddress: params.locationAddress,
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

