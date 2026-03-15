import { create } from "zustand";

import {
  listCards,
  tokenizeCard,
  addCard,
  removeCard,
  type Card,
  type AddCardRequest,
} from "@/api/cards-api";
import { resolveErrorMessage } from "@/lib/auth-helpers";
import { detectCardBrand } from "@/lib/card-brand";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { validateAddCardForm, type AddCardFormErrors } from "@/validation/add-card-schema";

interface AddCardForm {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddCardForm = {
  cardNumber: "",
  holderName: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
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
  confirmRemoveCardId: number | null;
}

interface CardsActions {
  loadCards: () => Promise<void>;
  addCard: () => Promise<void>;
  removeCard: (cardId: number) => Promise<void>;
  openAddDialog: () => void;
  closeAddDialog: () => void;
  setAddFormField: <K extends keyof AddCardForm>(field: K, value: AddCardForm[K]) => void;
  validateAddForm: () => boolean;
  setConfirmRemoveCardId: (cardId: number | null) => void;
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
  confirmRemoveCardId: null,

  loadCards: async () => {
    set({ isLoading: true, error: null });
    try {
      const cards = await listCards();
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
    const expiryMonth = parseInt(form.expiryMonth, 10);
    const expiryYear = parseInt(form.expiryYear, 10);

    set({ isAdding: true });
    try {
      const { gatewayToken } = await tokenizeCard({
        cardNumber: digits,
        cardCvv: form.cvv,
        holderName: form.holderName.toUpperCase(),
        expiryMonth,
        expiryYear,
        brand,
      });

      const data: AddCardRequest = {
        lastFourDigits,
        brand,
        holderName: form.holderName.toUpperCase(),
        expiryMonth,
        expiryYear,
        gatewayToken,
        isDefault: form.isDefault,
      };

      const newCard = await addCard(data);
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
      await removeCard(cardId);
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

  setConfirmRemoveCardId: (cardId) => set({ confirmRemoveCardId: cardId }),

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
      confirmRemoveCardId: null,
    }),
}));

export { useCardsStore };
