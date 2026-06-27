import { HttpClient } from "@/api/core/http-client";

interface CreatePublicAppointmentRequest {
  email: string;
  date: string;
  startTime: string;
  duration: number;
  serviceId: number;
  recurrenceType?: string;
  weeklyFrequency?: number;
  locationZip?: string;
  locationAddress?: string;
}

interface AppointmentResponse {
  id: number;
  uuid: string;
  date: string;
  startTime: string;
  duration: number;
  status: string;
  service: { id: number; name: string };
  client: { id: number; name: string; email: string };
}

interface RescheduleAppointmentRequest {
  date: string;
  startTime: string;
}

class AppointmentsApi {
  static createPublicAppointment(
    data: CreatePublicAppointmentRequest,
  ): Promise<AppointmentResponse> {
    return HttpClient.post<AppointmentResponse>("/appointments/public", data);
  }

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

export {
  AppointmentsApi,
  type CreatePublicAppointmentRequest,
  type RescheduleAppointmentRequest,
  type AppointmentResponse,
};
