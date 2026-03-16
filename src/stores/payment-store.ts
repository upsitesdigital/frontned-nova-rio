import { create } from "zustand";

import type { PaymentMethod } from "@/types/scheduling";
import { submitPayment } from "@/use-cases/submit-payment";
import { validatePayment, type PaymentFieldErrors } from "@/validation/payment-schema";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useRegistrationStore } from "@/stores/registration-store";
import { useServicesStore } from "@/stores/services-store";
import { useSchedulingStore } from "@/stores/scheduling-store";
import { useAddressStore } from "@/stores/address-store";

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

type PaymentStore = PaymentState & PaymentActions;

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

const usePaymentStore = create<PaymentStore>()((set) => ({
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

    const errors = validatePayment(
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
    const isValid = usePaymentStore.getState().validate();
    if (!isValid) return false;

    const email = useRegistrationStore.getState().email;
    if (!email) {
      set({ submitError: "E-mail não cadastrado. Volte ao passo de cadastro." });
      return false;
    }

    const selectedServiceId = useServicesStore.getState().selectedServiceId;
    if (!selectedServiceId) {
      set({ submitError: "Nenhum serviço selecionado." });
      return false;
    }

    const { selectedDate, selectedTime, recurrenceType } = useSchedulingStore.getState();
    if (!selectedDate || !selectedTime) {
      set({ submitError: "Data e horário não selecionados." });
      return false;
    }

    const { cep, address } = useAddressStore.getState();

    set({ isSubmitting: true, submitError: null });

    const result = await submitPayment({
      email,
      selectedServiceId,
      selectedDate,
      selectedTime,
      recurrenceType,
      cep,
      address,
    });

    if (result.success) {
      useConfirmationStore.getState().setConfirmation(result.confirmation);
      set({ isSubmitting: false });
      return true;
    }

    set({ isSubmitting: false, submitError: result.error });
    return false;
  },

  reset: () => set(initialState),
}));

export { usePaymentStore, type PaymentStore };
