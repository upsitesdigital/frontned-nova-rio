import { format } from "date-fns";

import { AppointmentsApi } from "@/api/client/appointments-api";
import { Messages } from "@/lib/core/messages";
import type { AppointmentConfirmation } from "@/types/appointment";
import type { Address } from "@/types/scheduling";

interface SubmitPaymentParams {
  email: string;
  selectedServiceId: number;
  selectedDate: Date;
  selectedTime: string;
  recurrenceType: string | null;
  recurrenceFrequency: string | null;
  weeklyFrequency: number;
  cep: string;
  address: Address | null;
}

type SubmitPaymentResult =
  | { success: true; confirmation: AppointmentConfirmation }
  | { success: false; error: string };

class SubmitPayment {
  private static readonly frequencyToRecurrence: Record<string, string> = {
    semanal: "WEEKLY",
    quinzenal: "BIWEEKLY",
    mensal: "MONTHLY",
  };

  static resolveRecurrenceType(
    recurrenceType: string | null,
    recurrenceFrequency: string | null,
  ): string | undefined {
    if (recurrenceType === "avulso") return "SINGLE";
    if (recurrenceType === "pacote") return "PACKAGE";
    if (recurrenceType === "recorrencia" && recurrenceFrequency) {
      return SubmitPayment.frequencyToRecurrence[recurrenceFrequency];
    }
    return undefined;
  }

  static async submitPayment(params: SubmitPaymentParams): Promise<SubmitPaymentResult> {
    try {
      const recurrenceType = SubmitPayment.resolveRecurrenceType(
        params.recurrenceType,
        params.recurrenceFrequency,
      );

      const response = await AppointmentsApi.createPublicAppointment({
        email: params.email,
        date: format(params.selectedDate, "yyyy-MM-dd"),
        startTime: params.selectedTime,
        duration: 120,
        serviceId: params.selectedServiceId,
        recurrenceType,
        weeklyFrequency: recurrenceType === "WEEKLY" ? params.weeklyFrequency : undefined,
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
      const message =
        error instanceof Error ? error.message : Messages.payment.createAppointmentError;
      return { success: false, error: message };
    }
  }
}

export { SubmitPayment, type SubmitPaymentParams, type SubmitPaymentResult };
