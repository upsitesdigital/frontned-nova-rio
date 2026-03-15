import { format } from "date-fns";

import { rescheduleAppointment, cancelAppointment } from "@/api/appointments-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface RescheduleAppointmentParams {
  appointmentId: number;
  date: Date;
  time: string;
}

interface AppointmentActionResult {
  success: boolean;
  error: string | null;
}

async function rescheduleClientAppointment(
  params: RescheduleAppointmentParams,
): Promise<AppointmentActionResult> {
  try {
    await rescheduleAppointment(params.appointmentId, {
      date: format(params.date, "yyyy-MM-dd"),
      startTime: params.time,
    });
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: resolveErrorMessage(error, MESSAGES.appointments.rescheduleError),
    };
  }
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

export {
  rescheduleClientAppointment,
  cancelClientAppointment,
  type RescheduleAppointmentParams,
  type AppointmentActionResult,
};
