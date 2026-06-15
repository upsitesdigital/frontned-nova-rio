import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    authGet: vi.fn(),
    authPost: vi.fn(),
    authDelete: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { CardsApi } from "./cards-api";

describe("cards-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listCards", () => {
    it("should call httpAuthGet with /cards", async () => {
      const cards = [{ id: 1, lastFourDigits: "1234", brand: "VISA" }];
      vi.mocked(HttpClient.authGet).mockResolvedValue(cards);

      const result = await CardsApi.listCards();

      expect(HttpClient.authGet).toHaveBeenCalledWith("/cards");
      expect(result).toEqual(cards);
    });
  });

  describe("removeCard", () => {
    it("should call httpAuthDelete with /cards/:id", async () => {
      vi.mocked(HttpClient.authDelete).mockResolvedValue(undefined);

      await CardsApi.removeCard(5);

      expect(HttpClient.authDelete).toHaveBeenCalledWith("/cards/5");
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
      vi.mocked(HttpClient.authPost).mockResolvedValue(card);

      const result = await CardsApi.addCard(data);

      expect(HttpClient.authPost).toHaveBeenCalledWith("/cards", data);
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
      vi.mocked(HttpClient.authPost).mockResolvedValue({ id: 11 });

      await CardsApi.addCard(data);

      expect(HttpClient.authPost).toHaveBeenCalledWith("/cards", data);
    });
  });

  describe("setDefaultCard", () => {
    it("should call httpAuthPost with /cards/:id/default and empty body", async () => {
      vi.mocked(HttpClient.authPost).mockResolvedValue(undefined);

      await CardsApi.setDefaultCard(3);

      expect(HttpClient.authPost).toHaveBeenCalledWith("/cards/3/default", {});
    });
  });
});
