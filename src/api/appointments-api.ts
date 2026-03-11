import { httpAuthPatch, httpAuthPost } from "./http-client";
import { appConfig } from "@/config/app";

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
  const response = await fetch(`${appConfig.apiBaseUrl}/appointments/public`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody === "object" && "message" in errorBody
        ? String(errorBody.message)
        : `POST /appointments/public failed: ${response.statusText}`;
    throw new Error(message);
  }

  return response.json() as Promise<AppointmentResponse>;
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
