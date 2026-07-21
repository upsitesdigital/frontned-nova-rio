import { format } from "date-fns";

import { AppointmentsApi } from "@/api/client/appointments-api";
import { PaymentsApi } from "@/api/client/payments-api";
import { Messages } from "@/lib/core/messages";
import type { AppointmentConfirmation } from "@/types/appointment";
import type { Address } from "@/types/scheduling";

interface PaymentCardData {
  cardNumber: string;
  cardCvv: string;
  cardExpiry: string;
  cardName: string;
}

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
  paymentMethod: string | null;
  cardData: PaymentCardData | null;
  billingName: string;
  billingDocument: string;
  billingAddress: string;
  billingComplement: string;
}

interface PaymentConfirmation {
  pixCode?: string;
  pixQrCodeUrl?: string;
}

interface SubmitPaymentSuccess {
  success: true;
  confirmation: AppointmentConfirmation;
  payment: PaymentConfirmation;
}

interface SubmitPaymentFailure {
  success: false;
  error: string;
}

type SubmitPaymentResult = SubmitPaymentSuccess | SubmitPaymentFailure;

export class SubmitPayment {
  private static readonly frequencyToRecurrence: Record<string, string> = {
    semanal: "WEEKLY",
    quinzenal: "BIWEEKLY",
    mensal: "MONTHLY",
  };

  private static resolveRecurrenceType(
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

  private static resolveApiPaymentMethod(paymentMethod: string | null): string {
    if (paymentMethod === "credit") return "CREDIT_CARD";
    if (paymentMethod === "debit") return "DEBIT_CARD";
    return "PIX";
  }

  static async submitPayment(params: SubmitPaymentParams): Promise<SubmitPaymentResult> {
    try {
      const recurrenceType = SubmitPayment.resolveRecurrenceType(
        params.recurrenceType,
        params.recurrenceFrequency,
      );

      const locationAddress = params.address
        ? `${params.address.street}, ${params.address.neighborhood}, ${params.address.city} - ${params.address.state}`
        : undefined;

      const appointmentPayload = {
        email: params.email,
        date: format(params.selectedDate, "yyyy-MM-dd"),
        startTime: params.selectedTime,
        duration: 120,
        serviceId: params.selectedServiceId,
        recurrenceType,
        weeklyFrequency: recurrenceType === "WEEKLY" ? params.weeklyFrequency : undefined,
        locationZip: params.cep || undefined,
        locationAddress,
      };

      const appointment = await AppointmentsApi.createPublicAppointment(appointmentPayload);

      const apiMethod = SubmitPayment.resolveApiPaymentMethod(params.paymentMethod);
      const isCardMethod = apiMethod === "CREDIT_CARD" || apiMethod === "DEBIT_CARD";

      const paymentResult = await PaymentsApi.createPublicPayment({
        paymentToken: appointment.paymentToken,
        email: params.email,
        appointmentId: appointment.id,
        method: apiMethod,
        ...(isCardMethod && params.cardData
          ? {
              cardNumber: params.cardData.cardNumber,
              cardCvv: params.cardData.cardCvv,
              cardExpiry: params.cardData.cardExpiry,
              holderName: params.cardData.cardName,
            }
          : {}),
        billingName: params.billingName || undefined,
        billingDocument: params.billingDocument || undefined,
        billingAddress: params.billingAddress || undefined,
        billingComplement: params.billingComplement || undefined,
      });

      return {
        success: true,
        confirmation: {
          serviceName: appointment.service.name,
          date: appointment.date,
          startTime: appointment.startTime,
        },
        payment: {
          pixCode: paymentResult.pixCode ?? undefined,
          pixQrCodeUrl: paymentResult.pixQrCodeUrl ?? undefined,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : Messages.payment.createAppointmentError;
      return { success: false, error: message };
    }
  }
}

export type { SubmitPaymentParams, SubmitPaymentResult };
