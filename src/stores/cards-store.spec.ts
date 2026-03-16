import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/load-client-cards", () => ({
  loadClientCards: vi.fn(),
}));

vi.mock("@/use-cases/add-client-card", () => ({
  addClientCard: vi.fn(),
}));

vi.mock("@/use-cases/remove-client-card", () => ({
  removeClientCard: vi.fn(),
}));

vi.mock("@/validation/add-card-schema", () => ({
  validateAddCardForm: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    cards: {
      loadError: "Erro ao carregar cartoes.",
      addSuccess: "Cartao adicionado!",
      addError: "Erro ao adicionar cartao.",
      removeSuccess: "Cartao removido!",
      removeError: "Erro ao remover cartao.",
    },
  },
}));

vi.mock("@/stores/toast-store", () => {
  const showToast = vi.fn();
  return {
    useToastStore: { getState: () => ({ showToast }) },
  };
});

const { loadClientCards } = await import("@/use-cases/load-client-cards");
const { addClientCard } = await import("@/use-cases/add-client-card");
const { removeClientCard } = await import("@/use-cases/remove-client-card");
const { validateAddCardForm } = await import("@/validation/add-card-schema");
const { useToastStore } = await import("@/stores/toast-store");

import { useCardsStore } from "./cards-store";

const mockCard = {
  id: 1,
  lastFourDigits: "1234",
  brand: "VISA",
  holderName: "JOHN DOE",
  expiryMonth: 12,
  expiryYear: 2028,
  isDefault: false,
};

const EMPTY_FORM = {
  cardNumber: "",
  holderName: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  isDefault: false,
};

describe("CardsStore", () => {
  beforeEach(() => {
    useCardsStore.getState().reset();
    vi.clearAllMocks();
    vi.mocked(validateAddCardForm).mockReturnValue({});
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useCardsStore.getState();

      expect(state.cards).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.addDialogOpen).toBe(false);
      expect(state.isAdding).toBe(false);
      expect(state.addForm).toEqual(EMPTY_FORM);
      expect(state.addFormErrors).toEqual({});
      expect(state.confirmRemoveCardId).toBeNull();
    });
  });

  describe("loadCards", () => {
    it("should load cards on success", async () => {
      vi.mocked(loadClientCards).mockResolvedValue({
        data: [mockCard] as never,
        error: null,
      });

      await useCardsStore.getState().loadCards();

      const state = useCardsStore.getState();
      expect(state.cards).toEqual([mockCard]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should set error on failure", async () => {
      vi.mocked(loadClientCards).mockResolvedValue({
        data: null,
        error: "Load error",
      });

      await useCardsStore.getState().loadCards();

      const state = useCardsStore.getState();
      expect(state.cards).toEqual([]);
      expect(state.error).toBe("Load error");
    });

    it("should set isLoading during API call", async () => {
      let resolvePromise!: (value: unknown) => void;
      vi.mocked(loadClientCards).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }) as never,
      );

      const promise = useCardsStore.getState().loadCards();
      expect(useCardsStore.getState().isLoading).toBe(true);

      resolvePromise({ data: [], error: null });
      await promise;

      expect(useCardsStore.getState().isLoading).toBe(false);
    });
  });

  describe("addCard", () => {
    it("should not proceed when validation fails", async () => {
      vi.mocked(validateAddCardForm).mockReturnValue({ cardNumber: "Invalid" });

      await useCardsStore.getState().addCard();

      expect(addClientCard).not.toHaveBeenCalled();
    });

    it("should add card, close dialog, and show toast on success", async () => {
      const newCard = { ...mockCard, id: 2 };
      vi.mocked(addClientCard).mockResolvedValue({
        success: true,
        card: newCard as never,
        error: null,
      });
      useCardsStore.setState({
        addForm: {
          cardNumber: "4111111111111111",
          holderName: "Test",
          expiryMonth: "12",
          expiryYear: "2028",
          cvv: "123",
          isDefault: false,
        },
      });

      await useCardsStore.getState().addCard();

      const state = useCardsStore.getState();
      expect(state.cards).toContainEqual(newCard);
      expect(state.addDialogOpen).toBe(false);
      expect(state.isAdding).toBe(false);
      expect(state.addForm).toEqual(EMPTY_FORM);
      expect(useToastStore.getState().showToast).toHaveBeenCalledWith(
        "Cartao adicionado!",
        "success",
      );
    });

    it("should prepend card and undefault others when isDefault is true", async () => {
      const existingCard = { ...mockCard, isDefault: true };
      const newCard = { ...mockCard, id: 2, isDefault: true };
      vi.mocked(addClientCard).mockResolvedValue({
        success: true,
        card: newCard as never,
        error: null,
      });
      useCardsStore.setState({
        cards: [existingCard] as never,
        addForm: {
          cardNumber: "4111111111111111",
          holderName: "Test",
          expiryMonth: "12",
          expiryYear: "2028",
          cvv: "123",
          isDefault: true,
        },
      });

      await useCardsStore.getState().addCard();

      const state = useCardsStore.getState();
      expect(state.cards[0]).toEqual(newCard);
      expect(state.cards[1]).toEqual({ ...existingCard, isDefault: false });
    });

    it("should show error toast on failure", async () => {
      vi.mocked(addClientCard).mockResolvedValue({
        success: false,
        error: "Card error",
      });
      useCardsStore.setState({
        addForm: {
          cardNumber: "4111111111111111",
          holderName: "Test",
          expiryMonth: "12",
          expiryYear: "2028",
          cvv: "123",
          isDefault: false,
        },
      });

      await useCardsStore.getState().addCard();

      expect(useToastStore.getState().showToast).toHaveBeenCalledWith("Card error", "error");
      expect(useCardsStore.getState().isAdding).toBe(false);
    });

    it("should use fallback error message when result.error is null", async () => {
      vi.mocked(addClientCard).mockResolvedValue({
        success: false,
        error: null,
      });
      useCardsStore.setState({
        addForm: {
          cardNumber: "4111111111111111",
          holderName: "Test",
          expiryMonth: "12",
          expiryYear: "2028",
          cvv: "123",
          isDefault: false,
        },
      });

      await useCardsStore.getState().addCard();

      expect(useToastStore.getState().showToast).toHaveBeenCalledWith(
        "Erro ao adicionar cartao.",
        "error",
      );
    });
  });

  describe("removeCard", () => {
    it("should remove card from list and show toast on success", async () => {
      vi.mocked(removeClientCard).mockResolvedValue({ success: true, error: null });
      useCardsStore.setState({ cards: [mockCard] as never });

      await useCardsStore.getState().removeCard(1);

      expect(useCardsStore.getState().cards).toEqual([]);
      expect(useToastStore.getState().showToast).toHaveBeenCalledWith(
        "Cartao removido!",
        "success",
      );
    });

    it("should show error toast on failure", async () => {
      vi.mocked(removeClientCard).mockResolvedValue({
        success: false,
        error: "Remove error",
      });

      await useCardsStore.getState().removeCard(1);

      expect(useToastStore.getState().showToast).toHaveBeenCalledWith("Remove error", "error");
    });

    it("should use fallback error when result.error is null", async () => {
      vi.mocked(removeClientCard).mockResolvedValue({
        success: false,
        error: null,
      });

      await useCardsStore.getState().removeCard(1);

      expect(useToastStore.getState().showToast).toHaveBeenCalledWith(
        "Erro ao remover cartao.",
        "error",
      );
    });
  });

  describe("openAddDialog / closeAddDialog", () => {
    it("should open dialog and reset form", () => {
      useCardsStore.setState({
        addForm: { ...EMPTY_FORM, cardNumber: "123" },
        addFormErrors: { cardNumber: "err" },
      });

      useCardsStore.getState().openAddDialog();

      const state = useCardsStore.getState();
      expect(state.addDialogOpen).toBe(true);
      expect(state.addForm).toEqual(EMPTY_FORM);
      expect(state.addFormErrors).toEqual({});
    });

    it("should close dialog and reset form", () => {
      useCardsStore.setState({ addDialogOpen: true });

      useCardsStore.getState().closeAddDialog();

      const state = useCardsStore.getState();
      expect(state.addDialogOpen).toBe(false);
      expect(state.addForm).toEqual(EMPTY_FORM);
      expect(state.addFormErrors).toEqual({});
    });
  });

  describe("setAddFormField", () => {
    it("should update form field and clear its error", () => {
      useCardsStore.setState({
        addFormErrors: { cardNumber: "Invalid" },
      });

      useCardsStore.getState().setAddFormField("cardNumber", "4111111111111111");

      const state = useCardsStore.getState();
      expect(state.addForm.cardNumber).toBe("4111111111111111");
      expect(state.addFormErrors.cardNumber).toBeUndefined();
    });
  });

  describe("setConfirmRemoveCardId", () => {
    it("should set confirmRemoveCardId", () => {
      useCardsStore.getState().setConfirmRemoveCardId(5);
      expect(useCardsStore.getState().confirmRemoveCardId).toBe(5);
    });

    it("should clear confirmRemoveCardId with null", () => {
      useCardsStore.setState({ confirmRemoveCardId: 5 });

      useCardsStore.getState().setConfirmRemoveCardId(null);

      expect(useCardsStore.getState().confirmRemoveCardId).toBeNull();
    });
  });

  describe("validateAddForm", () => {
    it("should return true when no errors", () => {
      vi.mocked(validateAddCardForm).mockReturnValue({});

      const result = useCardsStore.getState().validateAddForm();

      expect(result).toBe(true);
      expect(useCardsStore.getState().addFormErrors).toEqual({});
    });

    it("should return false and set errors when validation fails", () => {
      vi.mocked(validateAddCardForm).mockReturnValue({ cardNumber: "Invalid" });

      const result = useCardsStore.getState().validateAddForm();

      expect(result).toBe(false);
      expect(useCardsStore.getState().addFormErrors).toEqual({ cardNumber: "Invalid" });
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useCardsStore.setState({
        cards: [mockCard] as never,
        isLoading: true,
        error: "error",
        addDialogOpen: true,
        isAdding: true,
        addForm: { ...EMPTY_FORM, cardNumber: "123" },
        addFormErrors: { cardNumber: "err" },
        confirmRemoveCardId: 5,
      });

      useCardsStore.getState().reset();

      const state = useCardsStore.getState();
      expect(state.cards).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.addDialogOpen).toBe(false);
      expect(state.isAdding).toBe(false);
      expect(state.addForm).toEqual(EMPTY_FORM);
      expect(state.addFormErrors).toEqual({});
      expect(state.confirmRemoveCardId).toBeNull();
    });
  });
});
