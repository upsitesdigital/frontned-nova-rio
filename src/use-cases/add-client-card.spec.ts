import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/cards-api", () => ({
  tokenizeCard: vi.fn(),
  addCard: vi.fn(),
}));

vi.mock("@/api/http-client", () => ({
  HttpClientError: class HttpClientError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message);
      this.name = "HttpClientError";
    }
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  isAuthError: (error: unknown) =>
    error instanceof Error &&
    "status" in error &&
    ((error as { status: number }).status === 401 || (error as { status: number }).status === 403),
  resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

vi.mock("@/lib/card-brand", () => ({
  detectCardBrand: vi.fn().mockReturnValue("VISA"),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    cards: { addError: "Add card error" },
  },
}));

const api = await import("@/api/cards-api");
const cardBrand = await import("@/lib/card-brand");
const { addClientCard } = await import("./add-client-card");

const validInput = {
  cardNumber: "4111 1111 1111 1111",
  holderName: "John Doe",
  expiryMonth: "12",
  expiryYear: "2028",
  cvv: "123",
  isDefault: true,
};

const fakeCard = {
  id: 1,
  uuid: "uuid-1",
  lastFourDigits: "1111",
  brand: "VISA",
  holderName: "JOHN DOE",
  expiryMonth: 12,
  expiryYear: 2028,
  isDefault: true,
};

describe("addClientCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cardBrand.detectCardBrand).mockReturnValue("VISA");
  });

  describe("success", () => {
    it("should return success with card on valid input", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "token-abc" });
      vi.mocked(api.addCard).mockResolvedValue(fakeCard);

      const result = await addClientCard(validInput);

      expect(result).toEqual({ success: true, card: fakeCard, error: null });
    });

    it("should strip spaces from card number before tokenizing", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "token-abc" });
      vi.mocked(api.addCard).mockResolvedValue(fakeCard);

      await addClientCard(validInput);

      expect(api.tokenizeCard).toHaveBeenCalledWith(
        expect.objectContaining({ cardNumber: "4111111111111111" }),
      );
    });

    it("should uppercase holder name for tokenize and addCard", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "token-abc" });
      vi.mocked(api.addCard).mockResolvedValue(fakeCard);

      await addClientCard({ ...validInput, holderName: "jane smith" });

      expect(api.tokenizeCard).toHaveBeenCalledWith(
        expect.objectContaining({ holderName: "JANE SMITH" }),
      );
      expect(api.addCard).toHaveBeenCalledWith(
        expect.objectContaining({ holderName: "JANE SMITH" }),
      );
    });

    it("should pass last four digits to addCard", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "token-abc" });
      vi.mocked(api.addCard).mockResolvedValue(fakeCard);

      await addClientCard(validInput);

      expect(api.addCard).toHaveBeenCalledWith(
        expect.objectContaining({ lastFourDigits: "1111" }),
      );
    });

    it("should parse expiryMonth and expiryYear as integers", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "token-abc" });
      vi.mocked(api.addCard).mockResolvedValue(fakeCard);

      await addClientCard(validInput);

      expect(api.tokenizeCard).toHaveBeenCalledWith(
        expect.objectContaining({ expiryMonth: 12, expiryYear: 2028 }),
      );
      expect(api.addCard).toHaveBeenCalledWith(
        expect.objectContaining({ expiryMonth: 12, expiryYear: 2028 }),
      );
    });

    it("should detect card brand from stripped digits", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "token-abc" });
      vi.mocked(api.addCard).mockResolvedValue(fakeCard);

      await addClientCard(validInput);

      expect(cardBrand.detectCardBrand).toHaveBeenCalledWith("4111111111111111");
    });

    it("should pass gatewayToken from tokenize to addCard", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "gw-token-xyz" });
      vi.mocked(api.addCard).mockResolvedValue(fakeCard);

      await addClientCard(validInput);

      expect(api.addCard).toHaveBeenCalledWith(
        expect.objectContaining({ gatewayToken: "gw-token-xyz" }),
      );
    });

    it("should pass isDefault flag to addCard", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "token-abc" });
      vi.mocked(api.addCard).mockResolvedValue(fakeCard);

      await addClientCard({ ...validInput, isDefault: false });

      expect(api.addCard).toHaveBeenCalledWith(
        expect.objectContaining({ isDefault: false }),
      );
    });
  });

  describe("error handling", () => {
    it("should return error when tokenization fails", async () => {
      vi.mocked(api.tokenizeCard).mockRejectedValue(new Error("Tokenize failed"));

      const result = await addClientCard(validInput);

      expect(result).toEqual({ success: false, error: "Add card error" });
    });

    it("should return error when addCard fails", async () => {
      vi.mocked(api.tokenizeCard).mockResolvedValue({ gatewayToken: "token-abc" });
      vi.mocked(api.addCard).mockRejectedValue(new Error("Save failed"));

      const result = await addClientCard(validInput);

      expect(result).toEqual({ success: false, error: "Add card error" });
    });

    it("should not call addCard when tokenization fails", async () => {
      vi.mocked(api.tokenizeCard).mockRejectedValue(new Error("Tokenize failed"));

      await addClientCard(validInput);

      expect(api.addCard).not.toHaveBeenCalled();
    });
  });
});
