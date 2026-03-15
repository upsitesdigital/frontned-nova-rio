import { httpPost, httpAuthPatch, httpAuthPost } from "./http-client";

interface CreatePublicAppointmentRequest {
  email: string;
  date: string;
  startTime: string;
  duration: number;
  serviceId: number;
  recurrenceType?: string;
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

async function createPublicAppointment(
  data: CreatePublicAppointmentRequest,
): Promise<AppointmentResponse> {
  return httpPost<AppointmentResponse>("/appointments/public", data);
}

interface RescheduleAppointmentRequest {
  date: string;
  startTime: string;
}

async function rescheduleAppointment(
  token: string,
  appointmentId: number,
  data: RescheduleAppointmentRequest,
): Promise<AppointmentResponse> {
  return httpAuthPost<AppointmentResponse>(
    `/appointments/${appointmentId}/reschedule`,
    data,
    token,
  );
}

async function cancelAppointment(token: string, appointmentId: number): Promise<void> {
  return httpAuthPatch(`/appointments/${appointmentId}/cancel`, token);
}

export {
  createPublicAppointment,
  rescheduleAppointment,
  cancelAppointment,
  type CreatePublicAppointmentRequest,
  type RescheduleAppointmentRequest,
  type AppointmentResponse,
};
