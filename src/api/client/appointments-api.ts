import { HttpClient } from "@/api/core/http-client";

export interface AppointmentResponse {
  id: number;
  uuid: string;
  date: string;
  startTime: string;
  duration: number;
  status: string;
  service: { id: number; name: string };
  client: { id: number; name: string; email: string };
}

export interface RescheduleAppointmentRequest {
  date?: string;
  startTime?: string;
  recurrenceType?: string;
  locationZip?: string;
  locationAddress?: string;
}

export class AppointmentsApi {
  static rescheduleAppointment(
    appointmentId: number,
    data: RescheduleAppointmentRequest,
  ): Promise<AppointmentResponse> {
    return HttpClient.authPost<AppointmentResponse>(
      `/appointments/${appointmentId}/reschedule`,
      data,
    );
  }

  static cancelAppointment(appointmentId: number): Promise<void> {
    return HttpClient.authPatch(`/appointments/${appointmentId}/cancel`);
  }
}
