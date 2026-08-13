import { describe, it, expect } from "vitest";
import { CardBrand } from "./card-brand";

describe("card-brand", () => {
  describe("CardBrand.brandMap", () => {
    it("should map visa to VISA", () => {
      expect(CardBrand.brandMap["visa"]).toBe("VISA");
    });

    it("should map mastercard to MASTERCARD", () => {
      expect(CardBrand.brandMap["mastercard"]).toBe("MASTERCARD");
    });

    it("should map american-express to AMEX", () => {
      expect(CardBrand.brandMap["american-express"]).toBe("AMEX");
    });

    it("should map elo to ELO", () => {
      expect(CardBrand.brandMap["elo"]).toBe("ELO");
    });

    it("should map hipercard to HIPERCARD", () => {
      expect(CardBrand.brandMap["hipercard"]).toBe("HIPERCARD");
    });

    it("should map diners-club to DINERS", () => {
      expect(CardBrand.brandMap["diners-club"]).toBe("DINERS");
    });

    it("should map discover to DISCOVER", () => {
      expect(CardBrand.brandMap["discover"]).toBe("DISCOVER");
    });

    it("should map jcb to JCB", () => {
      expect(CardBrand.brandMap["jcb"]).toBe("JCB");
    });

    it("should contain exactly 8 brands", () => {
      expect(Object.keys(CardBrand.brandMap)).toHaveLength(8);
    });
  });

  describe("CardBrand.detectCardBrand", () => {
    it("should detect Visa card starting with 4", () => {
      expect(CardBrand.detectCardBrand("4111111111111111")).toBe("VISA");
    });

    it("should detect Mastercard starting with 5", () => {
      expect(CardBrand.detectCardBrand("5500000000000004")).toBe("MASTERCARD");
    });

    it("should return a brand or UNKNOWN for empty string", () => {
      const result = CardBrand.detectCardBrand("");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return UNKNOWN when no brand matches", () => {
      expect(CardBrand.detectCardBrand("0000000000000000")).toBe("UNKNOWN");
    });

    it("should detect brand from partial digits", () => {
      expect(CardBrand.detectCardBrand("411111")).toBe("VISA");
    });
  });
});
