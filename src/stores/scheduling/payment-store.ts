import { create } from "zustand";

import { Messages } from "@/lib/core/messages";
import { PaymentErrorMessage } from "@/lib/display/payment-error-message";
import type { PaymentMethod } from "@/types/scheduling";
import { SubmitPayment } from "@/use-cases/scheduling/submit-payment";
import { PaymentValidation, type PaymentFieldErrors } from "@/validation/payment-schema";
import { useConfirmationStore } from "@/stores/scheduling/confirmation-store";
import { useRegistrationStore } from "@/stores/auth/registration-store";
import { useServicesStore } from "@/stores/client/services-store";
import { useSchedulingStore } from "@/stores/scheduling/scheduling-store";
import { useAddressStore } from "@/stores/scheduling/address-store";

interface PaymentState {
  paymentMethod: PaymentMethod | null;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  billingName: string;
  billingDocument: string;
  billingAddress: string;
  billingComplement: string;
  errors: PaymentFieldErrors;
  isSubmitting: boolean;
  submitError: string | null;
}

interface PaymentActions {
  setPaymentMethod: (method: PaymentMethod) => void;
  setCardNumber: (value: string) => void;
  setCardExpiry: (value: string) => void;
  setCardCvv: (value: string) => void;
  setCardName: (value: string) => void;
  setBillingName: (value: string) => void;
  setBillingDocument: (value: string) => void;
  setBillingAddress: (value: string) => void;
  setBillingComplement: (value: string) => void;
  validate: () => boolean;
  pay: () => Promise<boolean>;
  reset: () => void;
}

const initialState: PaymentState = {
  paymentMethod: null,
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  cardName: "",
  billingName: "",
  billingDocument: "",
  billingAddress: "",
  billingComplement: "",
  errors: {},
  isSubmitting: false,
  submitError: null,
};

export const usePaymentStore = create<PaymentState & PaymentActions>()((set, get) => ({
  ...initialState,

  setPaymentMethod: (method) => set({ paymentMethod: method, errors: {}, submitError: null }),
  setCardNumber: (value) => set({ cardNumber: value, errors: {} }),
  setCardExpiry: (value) => set({ cardExpiry: value, errors: {} }),
  setCardCvv: (value) => set({ cardCvv: value, errors: {} }),
  setCardName: (value) => set({ cardName: value, errors: {} }),
  setBillingName: (value) => set({ billingName: value, errors: {} }),
  setBillingDocument: (value) => set({ billingDocument: value, errors: {} }),
  setBillingAddress: (value) => set({ billingAddress: value, errors: {} }),
  setBillingComplement: (value) => set({ billingComplement: value, errors: {} }),

  validate: () => {
    const state = usePaymentStore.getState();
    const isCardMethod = state.paymentMethod === "credit" || state.paymentMethod === "debit";

    const errors = PaymentValidation.validatePayment(
      isCardMethod,
      {
        cardNumber: state.cardNumber,
        cardExpiry: state.cardExpiry,
        cardCvv: state.cardCvv,
        cardName: state.cardName,
      },
      {
        billingName: state.billingName,
        billingDocument: state.billingDocument,
        billingAddress: state.billingAddress,
      },
    );

    if (Object.keys(errors).length > 0) {
      set({ errors });
      return false;
    }

    return true;
  },

  pay: async () => {
    if (get().isSubmitting) return false;
    const isValid = usePaymentStore.getState().validate();
    if (!isValid) {
      set({ submitError: Messages.payment.invalidFields });
      return false;
    }

    const email = useRegistrationStore.getState().email;
    if (!email) {
      set({ submitError: Messages.payment.missingEmail });
      return false;
    }

    const selectedServiceId = useServicesStore.getState().selectedServiceId;
    const services = useServicesStore.getState().services;
    const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;
    if (!selectedServiceId || !selectedService) {
      set({ submitError: Messages.payment.missingService });
      return false;
    }

    const { selectedDate, selectedTime, recurrenceType, recurrenceFrequency, weeklyFrequency } =
      useSchedulingStore.getState();
    if (!selectedDate || !selectedTime) {
      set({ submitError: Messages.payment.missingDateTime });
      return false;
    }

    const { cep, address } = useAddressStore.getState();

    const state = get();
    const isCardMethod = state.paymentMethod === "credit" || state.paymentMethod === "debit";

    set({ isSubmitting: true, submitError: null });

    const result = await SubmitPayment.submitPayment({
      email,
      selectedServiceId,
      serviceDurationMinutes: selectedService.durationMinutes,
      selectedDate,
      selectedTime,
      recurrenceType,
      recurrenceFrequency,
      weeklyFrequency,
      cep,
      address,
      paymentMethod: state.paymentMethod,
      cardData: isCardMethod
        ? {
            cardNumber: state.cardNumber,
            cardCvv: state.cardCvv,
            cardExpiry: state.cardExpiry,
            cardName: state.cardName,
          }
        : null,
      billingName: state.billingName,
      billingDocument: state.billingDocument,
      billingAddress: state.billingAddress,
      billingComplement: state.billingComplement,
    });

    if (result.success) {
      useConfirmationStore.getState().setConfirmation(result.confirmation);
      // Clear sensitive card/billing data so it is not carried into a next booking.
      set(initialState);
      return true;
    }

    set({ isSubmitting: false, submitError: PaymentErrorMessage.translate(result.error) });
    return false;
  },

  reset: () => set(initialState),
}));
