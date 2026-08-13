import { format } from "date-fns";

import { PaymentsApi, type CreatePublicCheckoutPayload } from "@/api/client/payments-api";
import { AuthHelpers } from "@/lib/auth/auth-helpers";
import { Messages } from "@/lib/core/messages";
import type { AppointmentConfirmation } from "@/types/appointment";
import type { Address } from "@/types/scheduling";

interface PaymentCardData {
  cardNumber: string;
  cardCvv: string;
  cardExpiry: string;
  cardName: string;
}

export interface SubmitPaymentParams {
  email: string;
  selectedServiceId: number;
  serviceDurationMinutes: number;
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

export interface SubmitPaymentSuccess {
  success: true;
  confirmation: AppointmentConfirmation;
  payment: PaymentConfirmation;
}

export interface SubmitPaymentFailure {
  success: false;
  error: string;
}

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

  static async submitPayment(
    params: SubmitPaymentParams,
  ): Promise<SubmitPaymentSuccess | SubmitPaymentFailure> {
    try {
      const recurrenceType = SubmitPayment.resolveRecurrenceType(
        params.recurrenceType,
        params.recurrenceFrequency,
      );

      const locationAddress = params.address
        ? `${params.address.street}, ${params.address.neighborhood}, ${params.address.city} - ${params.address.state}`
        : undefined;

      const apiMethod = SubmitPayment.resolveApiPaymentMethod(params.paymentMethod);
      const isCardMethod = apiMethod === "CREDIT_CARD" || apiMethod === "DEBIT_CARD";

      const checkoutPayload: CreatePublicCheckoutPayload = {
        email: params.email,
        date: format(params.selectedDate, "yyyy-MM-dd"),
        startTime: params.selectedTime,
        duration: params.serviceDurationMinutes,
        serviceId: params.selectedServiceId,
        recurrenceType,
        weeklyFrequency:
          recurrenceType === "WEEKLY" ||
          recurrenceType === "BIWEEKLY" ||
          recurrenceType === "MONTHLY"
            ? params.weeklyFrequency
            : undefined,
        locationZip: params.cep || undefined,
        locationAddress,
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
      };

      const result = await PaymentsApi.createPublicCheckout(checkoutPayload);

      return {
        success: true,
        confirmation: {
          serviceName: result.appointment.service.name,
          // Backend serializes the date as UTC midnight ("…T00:00:00.000Z"); keep only the
          // calendar day so the confirmation screen doesn't shift a day in negative offsets.
          date: result.appointment.date.slice(0, 10),
          startTime: result.appointment.startTime,
        },
        payment: {
          pixCode: result.pixCode ?? undefined,
          pixQrCodeUrl: result.pixQrCodeUrl ?? undefined,
        },
      };
    } catch (error) {
      const message = AuthHelpers.resolveErrorMessage(
        error,
        Messages.payment.createAppointmentError,
      );
      return { success: false, error: message };
    }
  }
}
