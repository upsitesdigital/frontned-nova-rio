import { create } from "zustand";

import type { PaymentMethod } from "@/types/scheduling";

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
};

const usePaymentStore = create<PaymentStore>()((set) => ({
  ...initialState,

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setCardNumber: (value) => set({ cardNumber: value }),
  setCardExpiry: (value) => set({ cardExpiry: value }),
  setCardCvv: (value) => set({ cardCvv: value }),
  setCardName: (value) => set({ cardName: value }),
  setBillingName: (value) => set({ billingName: value }),
  setBillingDocument: (value) => set({ billingDocument: value }),
  setBillingAddress: (value) => set({ billingAddress: value }),
  setBillingComplement: (value) => set({ billingComplement: value }),

  reset: () => set(initialState),
}));

export { usePaymentStore, type PaymentStore };
