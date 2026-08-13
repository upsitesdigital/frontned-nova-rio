import { describe, it, expect, vi } from "vitest";

vi.mock("credit-card-type", () => ({
  default: vi.fn((digits: string) => {
    if (digits.startsWith("4")) return [{ type: "visa", niceType: "Visa" }];
    if (digits.startsWith("55")) return [{ type: "mastercard", niceType: "Mastercard" }];
    return [];
  }),
}));

describe("card-format", () => {
  describe("normalizeBrand", () => {
    it("should return 'visa' for 'visa'", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.normalizeBrand("visa")).toBe("visa");
    });

    it("should return 'visa' for 'VISA'", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.normalizeBrand("VISA")).toBe("visa");
    });

    it("should return 'visa' for 'Visa'", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.normalizeBrand("Visa")).toBe("visa");
    });

    it("should return 'mastercard' for 'mastercard'", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.normalizeBrand("mastercard")).toBe("mastercard");
    });

    it("should return 'mastercard' for 'MASTERCARD'", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.normalizeBrand("MASTERCARD")).toBe("mastercard");
    });

    it("should return 'other' for unknown brand", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.normalizeBrand("amex")).toBe("other");
    });

    it("should return 'other' for empty string", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.normalizeBrand("")).toBe("other");
    });
  });

  describe("getDetectedBrandLabel", () => {
    it("should return brand label for a Visa number", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.getDetectedBrandLabel("4111 1111 1111 1111")).toBe("Visa");
    });

    it("should return brand label for a Mastercard number", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.getDetectedBrandLabel("5500 0000 0000 0004")).toBe("Mastercard");
    });

    it("should return empty string for less than 2 digits", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.getDetectedBrandLabel("4")).toBe("");
    });

    it("should return empty string for empty input", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.getDetectedBrandLabel("")).toBe("");
    });

    it("should return empty string when no brand detected", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.getDetectedBrandLabel("00 0000")).toBe("");
    });

    it("should strip spaces before detecting", async () => {
      const { CardFormat } = await import("./card-format");
      expect(CardFormat.getDetectedBrandLabel("4 1 1 1")).toBe("Visa");
    });
  });
});
