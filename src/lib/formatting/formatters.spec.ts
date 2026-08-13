import { describe, it, expect } from "vitest";
import { Formatters } from "./formatters";

describe("formatters", () => {
  describe("Formatters.formatPrice", () => {
    it("should format integer price", () => {
      expect(Formatters.formatPrice(100)).toBe("A partir de R$ 100,00");
    });

    it("should format decimal price", () => {
      expect(Formatters.formatPrice(49.9)).toBe("A partir de R$ 49,90");
    });

    it("should format zero", () => {
      expect(Formatters.formatPrice(0)).toBe("A partir de R$ 0,00");
    });

    it("should round to 2 decimal places", () => {
      expect(Formatters.formatPrice(10.999)).toBe("A partir de R$ 11,00");
    });
  });

  describe("Formatters.formatCep", () => {
    it("should return digits only for 5 or fewer digits", () => {
      expect(Formatters.formatCep("12345")).toBe("12345");
    });

    it("should format full CEP with hyphen", () => {
      expect(Formatters.formatCep("12345678")).toBe("12345-678");
    });

    it("should strip non-digit characters", () => {
      expect(Formatters.formatCep("123.45-678")).toBe("12345-678");
    });

    it("should truncate input beyond 8 digits", () => {
      expect(Formatters.formatCep("123456789")).toBe("12345-678");
    });

    it("should handle empty string", () => {
      expect(Formatters.formatCep("")).toBe("");
    });

    it("should format partial input with 6 digits", () => {
      expect(Formatters.formatCep("123456")).toBe("12345-6");
    });
  });

  describe("Formatters.formatPhone", () => {
    it("should show the area-code prefix for 2 or fewer digits", () => {
      expect(Formatters.formatPhone("11")).toBe("(11");
    });

    it("should format with area code for 3-7 digits", () => {
      expect(Formatters.formatPhone("11999")).toBe("(11) 999");
    });

    it("should format full phone number", () => {
      expect(Formatters.formatPhone("11999887766")).toBe("(11) 99988-7766");
    });

    it("should strip non-digit characters", () => {
      expect(Formatters.formatPhone("(11) 99988-7766")).toBe("(11) 99988-7766");
    });

    it("should truncate beyond 11 digits", () => {
      expect(Formatters.formatPhone("119998877661")).toBe("(11) 99988-7766");
    });

    it("should handle empty string", () => {
      expect(Formatters.formatPhone("")).toBe("");
    });

    it("should format 8 digits with area code and hyphen", () => {
      expect(Formatters.formatPhone("11999887")).toBe("(11) 99988-7");
    });
  });

  describe("Formatters.formatCardNumber", () => {
    it("should group digits into blocks of 4", () => {
      expect(Formatters.formatCardNumber("4111111111111111")).toBe("4111 1111 1111 1111");
    });

    it("should strip non-digit characters", () => {
      expect(Formatters.formatCardNumber("4111-1111-1111-1111")).toBe("4111 1111 1111 1111");
    });

    it("should truncate beyond 16 digits", () => {
      expect(Formatters.formatCardNumber("41111111111111112")).toBe("4111 1111 1111 1111");
    });

    it("should handle partial card number", () => {
      expect(Formatters.formatCardNumber("41111")).toBe("4111 1");
    });

    it("should handle empty string", () => {
      expect(Formatters.formatCardNumber("")).toBe("");
    });
  });

  describe("Formatters.formatExpiry", () => {
    it("should return digits only for 2 or fewer digits", () => {
      expect(Formatters.formatExpiry("12")).toBe("12");
    });

    it("should format with slash for 3+ digits", () => {
      expect(Formatters.formatExpiry("1225")).toBe("12/25");
    });

    it("should strip non-digit characters", () => {
      expect(Formatters.formatExpiry("12/25")).toBe("12/25");
    });

    it("should truncate beyond 4 digits", () => {
      expect(Formatters.formatExpiry("12256")).toBe("12/25");
    });

    it("should handle empty string", () => {
      expect(Formatters.formatExpiry("")).toBe("");
    });

    it("should handle single digit", () => {
      expect(Formatters.formatExpiry("1")).toBe("1");
    });
  });

  describe("Formatters.formatCpfCnpj", () => {
    it("should return digits only for 3 or fewer digits", () => {
      expect(Formatters.formatCpfCnpj("123")).toBe("123");
    });

    it("should format CPF with first dot for 4-6 digits", () => {
      expect(Formatters.formatCpfCnpj("1234")).toBe("123.4");
      expect(Formatters.formatCpfCnpj("123456")).toBe("123.456");
    });

    it("should format CPF with two dots for 7-9 digits", () => {
      expect(Formatters.formatCpfCnpj("1234567")).toBe("123.456.7");
      expect(Formatters.formatCpfCnpj("123456789")).toBe("123.456.789");
    });

    it("should format full CPF with dots and hyphen", () => {
      expect(Formatters.formatCpfCnpj("12345678901")).toBe("123.456.789-01");
    });

    it("should format CNPJ with dots, slash, and hyphen", () => {
      expect(Formatters.formatCpfCnpj("12345678000195")).toBe("12.345.678/0001-95");
    });

    it("should format partial CNPJ (12 digits)", () => {
      expect(Formatters.formatCpfCnpj("123456780001")).toBe("12.345.678/0001");
    });

    it("should strip non-digit characters", () => {
      expect(Formatters.formatCpfCnpj("123.456.789-01")).toBe("123.456.789-01");
    });

    it("should truncate beyond 14 digits", () => {
      expect(Formatters.formatCpfCnpj("123456780001951")).toBe("12.345.678/0001-95");
    });

    it("should handle empty string", () => {
      expect(Formatters.formatCpfCnpj("")).toBe("");
    });
  });

  describe("Formatters.formatCurrency", () => {
    it("should format integer value", () => {
      expect(Formatters.formatCurrency(100)).toBe("R$100,00");
    });

    it("should format decimal value", () => {
      expect(Formatters.formatCurrency(49.9)).toBe("R$49,90");
    });

    it("should format zero", () => {
      expect(Formatters.formatCurrency(0)).toBe("R$0,00");
    });

    it("should round to 2 decimal places", () => {
      expect(Formatters.formatCurrency(10.999)).toBe("R$11,00");
    });

    it("should format negative value", () => {
      expect(Formatters.formatCurrency(-5.5)).toBe("R$-5,50");
    });
  });
});
