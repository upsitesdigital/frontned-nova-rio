import { create } from "zustand";

import type { Card } from "@/api/cards-api";
import { MESSAGES } from "@/lib/messages";
import { useToastStore } from "@/stores/toast-store";
import { addClientCard } from "@/use-cases/add-client-card";
import { loadClientCards } from "@/use-cases/load-client-cards";
import { removeClientCard } from "@/use-cases/remove-client-card";
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

    const result = await loadClientCards();
    set({
      cards: result.data ?? [],
      isLoading: false,
      error: result.error,
    });
  },

  addCard: async () => {
    if (!get().validateAddForm()) return;
    const form = get().addForm;

    set({ isAdding: true });

    const result = await addClientCard({
      cardNumber: form.cardNumber,
      holderName: form.holderName,
      expiryMonth: form.expiryMonth,
      expiryYear: form.expiryYear,
      cvv: form.cvv,
      isDefault: form.isDefault,
    });

    if (result.success && result.card) {
      set((state) => ({
        cards: form.isDefault
          ? [result.card!, ...state.cards.map((c) => ({ ...c, isDefault: false }))]
          : [...state.cards, result.card!],
        addDialogOpen: false,
        isAdding: false,
        addForm: { ...EMPTY_FORM },
        addFormErrors: {},
      }));
      useToastStore.getState().showToast(MESSAGES.cards.addSuccess, "success");
    } else {
      useToastStore.getState().showToast(result.error ?? MESSAGES.cards.addError, "error");
      set({ isAdding: false });
    }
  },

  removeCard: async (cardId: number) => {
    const result = await removeClientCard(cardId);

    if (result.success) {
      set((state) => ({ cards: state.cards.filter((c) => c.id !== cardId) }));
      useToastStore.getState().showToast(MESSAGES.cards.removeSuccess, "success");
    } else {
      useToastStore.getState().showToast(result.error ?? MESSAGES.cards.removeError, "error");
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
