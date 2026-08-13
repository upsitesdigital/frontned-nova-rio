import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
  httpAuthPost: vi.fn(),
  httpAuthDelete: vi.fn(),
}));

const { httpAuthGet, httpAuthPost, httpAuthDelete } = await import("./http-client");

import {
  listCards,
  tokenizeCard,
  addCard,
  removeCard,
  setDefaultCard,
} from "./cards-api";

describe("cards-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listCards", () => {
    it("should call httpAuthGet with /cards", async () => {
      const cards = [{ id: 1, lastFourDigits: "1234", brand: "VISA" }];
      vi.mocked(httpAuthGet).mockResolvedValue(cards);

      const result = await listCards();

      expect(httpAuthGet).toHaveBeenCalledWith("/cards");
      expect(result).toEqual(cards);
    });
  });

  describe("removeCard", () => {
    it("should call httpAuthDelete with /cards/:id", async () => {
      vi.mocked(httpAuthDelete).mockResolvedValue(undefined);

      await removeCard(5);

      expect(httpAuthDelete).toHaveBeenCalledWith("/cards/5");
    });
  });

  describe("tokenizeCard", () => {
    it("should call httpAuthPost with /cards/tokenize and card data", async () => {
      const data = {
        cardNumber: "4111111111111111",
        cardCvv: "123",
        holderName: "JOAO SILVA",
        expiryMonth: 12,
        expiryYear: 2028,
        brand: "VISA",
      };
      const response = { gatewayToken: "tok_abc123" };
      vi.mocked(httpAuthPost).mockResolvedValue(response);

      const result = await tokenizeCard(data);

      expect(httpAuthPost).toHaveBeenCalledWith("/cards/tokenize", data);
      expect(result).toEqual(response);
    });
  });

  describe("addCard", () => {
    it("should call httpAuthPost with /cards and card data", async () => {
      const data = {
        lastFourDigits: "1111",
        brand: "VISA",
        holderName: "JOAO SILVA",
        expiryMonth: 12,
        expiryYear: 2028,
        gatewayToken: "tok_abc123",
      };
      const card = { id: 10, ...data, uuid: "uuid-1", isDefault: false };
      vi.mocked(httpAuthPost).mockResolvedValue(card);

      const result = await addCard(data);

      expect(httpAuthPost).toHaveBeenCalledWith("/cards", data);
      expect(result).toEqual(card);
    });

    it("should include optional isDefault when provided", async () => {
      const data = {
        lastFourDigits: "5678",
        brand: "MASTERCARD",
        holderName: "ANA SOUZA",
        expiryMonth: 6,
        expiryYear: 2027,
        gatewayToken: "tok_xyz",
        isDefault: true,
      };
      vi.mocked(httpAuthPost).mockResolvedValue({ id: 11 });

      await addCard(data);

      expect(httpAuthPost).toHaveBeenCalledWith("/cards", data);
    });
  });

  describe("setDefaultCard", () => {
    it("should call httpAuthPost with /cards/:id/default and empty body", async () => {
      vi.mocked(httpAuthPost).mockResolvedValue(undefined);

      await setDefaultCard(3);

      expect(httpAuthPost).toHaveBeenCalledWith("/cards/3/default", {});
    });
  });
});
