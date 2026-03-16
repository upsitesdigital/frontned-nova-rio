import { describe, it, expect } from "vitest";
import { detectCardBrand, BRAND_MAP } from "./card-brand";

describe("card-brand", () => {
  describe("BRAND_MAP", () => {
    it("should map visa to VISA", () => {
      expect(BRAND_MAP["visa"]).toBe("VISA");
    });

    it("should map mastercard to MASTERCARD", () => {
      expect(BRAND_MAP["mastercard"]).toBe("MASTERCARD");
    });

    it("should map american-express to AMEX", () => {
      expect(BRAND_MAP["american-express"]).toBe("AMEX");
    });

    it("should map elo to ELO", () => {
      expect(BRAND_MAP["elo"]).toBe("ELO");
    });

    it("should map hipercard to HIPERCARD", () => {
      expect(BRAND_MAP["hipercard"]).toBe("HIPERCARD");
    });

    it("should map diners-club to DINERS", () => {
      expect(BRAND_MAP["diners-club"]).toBe("DINERS");
    });

    it("should map discover to DISCOVER", () => {
      expect(BRAND_MAP["discover"]).toBe("DISCOVER");
    });

    it("should map jcb to JCB", () => {
      expect(BRAND_MAP["jcb"]).toBe("JCB");
    });

    it("should contain exactly 8 brands", () => {
      expect(Object.keys(BRAND_MAP)).toHaveLength(8);
    });
  });

  describe("detectCardBrand", () => {
    it("should detect Visa card starting with 4", () => {
      expect(detectCardBrand("4111111111111111")).toBe("VISA");
    });

    it("should detect Mastercard starting with 5", () => {
      expect(detectCardBrand("5500000000000004")).toBe("MASTERCARD");
    });

    it("should return a brand or UNKNOWN for empty string", () => {
      const result = detectCardBrand("");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return UNKNOWN when no brand matches", () => {
      expect(detectCardBrand("0000000000000000")).toBe("UNKNOWN");
    });

    it("should detect brand from partial digits", () => {
      expect(detectCardBrand("411111")).toBe("VISA");
    });
  });
});
