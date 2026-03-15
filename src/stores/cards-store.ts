import { create } from "zustand";

import { listCards, addCard, removeCard, type Card, type AddCardRequest } from "@/api/cards-api";
import { getAuthToken, resolveErrorMessage } from "@/lib/auth-helpers";
import { detectCardBrand } from "@/lib/card-brand";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { validateAddCardForm, type AddCardFormErrors } from "@/validation/add-card-schema";

interface AddCardForm {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddCardForm = {
  cardNumber: "",
  holderName: "",
  expiryMonth: "",
  expiryYear: "",
  isDefault: false,
};

interface CardsState {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  addDialogOpen: boolean;
  isAdding: boolean;
  addForm: AddCardForm;
  addFormErrors: AddCardFormErrors;
}

interface CardsActions {
  loadCards: () => Promise<void>;
  addCard: () => Promise<void>;
  removeCard: (cardId: number) => Promise<void>;
  openAddDialog: () => void;
  closeAddDialog: () => void;
  setAddFormField: <K extends keyof AddCardForm>(field: K, value: AddCardForm[K]) => void;
  validateAddForm: () => boolean;
  reset: () => void;
}

const useCardsStore = create<CardsState & CardsActions>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,
  addDialogOpen: false,
  isAdding: false,
  addForm: { ...EMPTY_FORM },
  addFormErrors: {},

  loadCards: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      const cards = await listCards(token ?? "");
      set({ cards, isLoading: false });
    } catch (e) {
      set({
        error: resolveErrorMessage(e, MESSAGES.cards.loadError),
        isLoading: false,
      });
    }
  },

  addCard: async () => {
    if (!get().validateAddForm()) return;
    const form = get().addForm;
    const digits = form.cardNumber.replace(/\s/g, "");
    const lastFourDigits = digits.slice(-4);
    const brand = detectCardBrand(digits);

    // TODO: Gateway tokenization (e.g., Stripe/PagSeguro) must be integrated here.
    // The token should come from the payment provider's SDK after tokenizing the full card number.
    // Until then, only lastFourDigits and brand are sent to the backend (PCI-compliant).

    const data: AddCardRequest = {
      lastFourDigits,
      brand,
      holderName: form.holderName.toUpperCase(),
      expiryDate: `${form.expiryMonth.padStart(2, "0")}/${form.expiryYear}`,
      isDefault: form.isDefault,
    };
    set({ isAdding: true });
    try {
      const token = await getAuthToken();
      const newCard = await addCard(token ?? "", data);
      set((state) => ({
        cards: data.isDefault
          ? [newCard, ...state.cards.map((c) => ({ ...c, isDefault: false }))]
          : [...state.cards, newCard],
        addDialogOpen: false,
        isAdding: false,
        addForm: { ...EMPTY_FORM },
        addFormErrors: {},
      }));
      useToastStore.getState().showToast(MESSAGES.cards.addSuccess, "success");
    } catch (e) {
      useToastStore.getState().showToast(resolveErrorMessage(e, MESSAGES.cards.addError), "error");
      set({ isAdding: false });
    }
  },

  removeCard: async (cardId: number) => {
    try {
      const token = await getAuthToken();
      await removeCard(token ?? "", cardId);
      set((state) => ({ cards: state.cards.filter((c) => c.id !== cardId) }));
      useToastStore.getState().showToast(MESSAGES.cards.removeSuccess, "success");
    } catch (e) {
      useToastStore
        .getState()
        .showToast(resolveErrorMessage(e, MESSAGES.cards.removeError), "error");
    }
  },

  openAddDialog: () => set({ addDialogOpen: true, addForm: { ...EMPTY_FORM }, addFormErrors: {} }),
  closeAddDialog: () =>
    set({ addDialogOpen: false, addForm: { ...EMPTY_FORM }, addFormErrors: {} }),

  setAddFormField: (field, value) =>
    set((state) => ({
      addForm: { ...state.addForm, [field]: value },
      addFormErrors: { ...state.addFormErrors, [field]: undefined },
    })),

  validateAddForm: () => {
    const errors = validateAddCardForm(get().addForm);
    set({ addFormErrors: errors });
    return Object.keys(errors).length === 0;
  },

  reset: () =>
    set({
      cards: [],
      isLoading: false,
      error: null,
      addDialogOpen: false,
      isAdding: false,
      addForm: { ...EMPTY_FORM },
      addFormErrors: {},
    }),
}));

export { useCardsStore };
