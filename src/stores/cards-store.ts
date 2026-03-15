import { create } from "zustand";
import isCreditCard from "validator/es/lib/isCreditCard";
import { listCards, addCard, removeCard, type Card, type AddCardRequest } from "@/api/cards-api";
import { HttpClientError } from "@/api/http-client";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";

interface AddCardForm {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface AddCardFormErrors {
  cardNumber?: string;
  holderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
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
      await waitForAuthHydration();
      const token = useAuthStore.getState().accessToken ?? "";
      const cards = await listCards(token);
      set({ cards, isLoading: false });
    } catch (e) {
      const message = e instanceof HttpClientError ? e.message : "Erro ao carregar cartões";
      set({ error: message, isLoading: false });
    }
  },

  addCard: async () => {
    if (!get().validateAddForm()) return;
    const form = get().addForm;
    const digits = form.cardNumber.replace(/\s/g, "");
    const data: AddCardRequest = {
      cardNumber: digits,
      holderName: form.holderName.toUpperCase(),
      expiryMonth: Number(form.expiryMonth),
      expiryYear: Number(form.expiryYear),
      gatewayToken: "tok_dev_local",
      isDefault: form.isDefault,
    };
    set({ isAdding: true });
    try {
      await waitForAuthHydration();
      const token = useAuthStore.getState().accessToken ?? "";
      const newCard = await addCard(token, data);
      set((state) => ({
        cards: data.isDefault
          ? [newCard, ...state.cards.map((c) => ({ ...c, isDefault: false }))]
          : [...state.cards, newCard],
        addDialogOpen: false,
        isAdding: false,
        addForm: { ...EMPTY_FORM },
        addFormErrors: {},
      }));
      useToastStore.getState().showToast("Cartão adicionado com sucesso", "success");
    } catch (e) {
      const message = e instanceof HttpClientError ? e.message : "Erro ao adicionar cartão";
      useToastStore.getState().showToast(message, "error");
      set({ isAdding: false });
    }
  },

  removeCard: async (cardId: number) => {
    try {
      await waitForAuthHydration();
      const token = useAuthStore.getState().accessToken ?? "";
      await removeCard(token, cardId);
      set((state) => ({ cards: state.cards.filter((c) => c.id !== cardId) }));
      useToastStore.getState().showToast("Cartão removido com sucesso", "success");
    } catch (e) {
      const message = e instanceof HttpClientError ? e.message : "Erro ao remover cartão";
      useToastStore.getState().showToast(message, "error");
    }
  },

  openAddDialog: () => set({ addDialogOpen: true, addForm: { ...EMPTY_FORM }, addFormErrors: {} }),
  closeAddDialog: () => set({ addDialogOpen: false, addForm: { ...EMPTY_FORM }, addFormErrors: {} }),

  setAddFormField: (field, value) =>
    set((state) => ({ addForm: { ...state.addForm, [field]: value }, addFormErrors: { ...state.addFormErrors, [field]: undefined } })),

  validateAddForm: () => {
    const { cardNumber, holderName, expiryMonth, expiryYear } = get().addForm;
    const errors: AddCardFormErrors = {};
    const digits = cardNumber.replace(/\s/g, "");
    if (!isCreditCard(digits)) errors.cardNumber = "Número do cartão inválido";
    if (!holderName.trim()) errors.holderName = "Informe o nome impresso no cartão";
    if (!expiryMonth) errors.expiryMonth = "Selecione o mês";
    if (!expiryYear) errors.expiryYear = "Selecione o ano";
    set({ addFormErrors: errors });
    return Object.keys(errors).length === 0;
  },

  reset: () => set({ cards: [], isLoading: false, error: null, addDialogOpen: false, isAdding: false, addForm: { ...EMPTY_FORM }, addFormErrors: {} }),
}));

export { useCardsStore };
