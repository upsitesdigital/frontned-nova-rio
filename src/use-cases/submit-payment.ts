import { format } from "date-fns";

import { createPublicAppointment } from "@/api/appointments-api";
import type { AppointmentConfirmation } from "@/types/appointment";
import type { Address } from "@/types/scheduling";

interface SubmitPaymentParams {
  email: string;
  selectedServiceId: number;
  selectedDate: Date;
  selectedTime: string;
  recurrenceType: string | null;
  cep: string;
  address: Address | null;
}

type SubmitPaymentResult =
  | { success: true; confirmation: AppointmentConfirmation }
  | { success: false; error: string };

const RECURRENCE_MAP: Record<string, string> = {
  avulso: "SINGLE",
  pacote: "PACKAGE",
  recorrencia: "RECURRING",
};

async function submitPayment(params: SubmitPaymentParams): Promise<SubmitPaymentResult> {
  try {
    const response = await createPublicAppointment({
      email: params.email,
      date: format(params.selectedDate, "yyyy-MM-dd"),
      startTime: params.selectedTime,
      duration: 120,
      serviceId: params.selectedServiceId,
      recurrenceType: params.recurrenceType ? RECURRENCE_MAP[params.recurrenceType] : undefined,
      locationZip: params.cep || undefined,
      locationAddress: params.address
        ? `${params.address.street}, ${params.address.neighborhood}, ${params.address.city} - ${params.address.state}`
        : undefined,
    });

    return {
      success: true,
      confirmation: {
        serviceName: response.service.name,
        date: response.date,
        startTime: response.startTime,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar agendamento.";
    return { success: false, error: message };
  }
}

export { submitPayment, type SubmitPaymentParams, type SubmitPaymentResult };
