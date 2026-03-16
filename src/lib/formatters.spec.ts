import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatCep,
  formatPhone,
  formatCardNumber,
  formatExpiry,
  formatCpfCnpj,
  formatCurrency,
} from "./formatters";

describe("formatters", () => {
  describe("formatPrice", () => {
    it("should format integer price", () => {
      expect(formatPrice(100)).toBe("A partir de R$ 100,00");
    });

    it("should format decimal price", () => {
      expect(formatPrice(49.9)).toBe("A partir de R$ 49,90");
    });

    it("should format zero", () => {
      expect(formatPrice(0)).toBe("A partir de R$ 0,00");
    });

    it("should round to 2 decimal places", () => {
      expect(formatPrice(10.999)).toBe("A partir de R$ 11,00");
    });
  });

  describe("formatCep", () => {
    it("should return digits only for 5 or fewer digits", () => {
      expect(formatCep("12345")).toBe("12345");
    });

    it("should format full CEP with hyphen", () => {
      expect(formatCep("12345678")).toBe("12345-678");
    });

    it("should strip non-digit characters", () => {
      expect(formatCep("123.45-678")).toBe("12345-678");
    });

    it("should truncate input beyond 8 digits", () => {
      expect(formatCep("123456789")).toBe("12345-678");
    });

    it("should handle empty string", () => {
      expect(formatCep("")).toBe("");
    });

    it("should format partial input with 6 digits", () => {
      expect(formatCep("123456")).toBe("12345-6");
    });
  });

  describe("formatPhone", () => {
    it("should return digits only for 2 or fewer digits", () => {
      expect(formatPhone("11")).toBe("11");
    });

    it("should format with area code for 3-7 digits", () => {
      expect(formatPhone("11999")).toBe("(11) 999");
    });

    it("should format full phone number", () => {
      expect(formatPhone("11999887766")).toBe("(11) 99988-7766");
    });

    it("should strip non-digit characters", () => {
      expect(formatPhone("(11) 99988-7766")).toBe("(11) 99988-7766");
    });

    it("should truncate beyond 11 digits", () => {
      expect(formatPhone("119998877661")).toBe("(11) 99988-7766");
    });

    it("should handle empty string", () => {
      expect(formatPhone("")).toBe("");
    });

    it("should format 8 digits with area code and hyphen", () => {
      expect(formatPhone("11999887")).toBe("(11) 99988-7");
    });
  });

  describe("formatCardNumber", () => {
    it("should group digits into blocks of 4", () => {
      expect(formatCardNumber("4111111111111111")).toBe("4111 1111 1111 1111");
    });

    it("should strip non-digit characters", () => {
      expect(formatCardNumber("4111-1111-1111-1111")).toBe("4111 1111 1111 1111");
    });

    it("should truncate beyond 16 digits", () => {
      expect(formatCardNumber("41111111111111112")).toBe("4111 1111 1111 1111");
    });

    it("should handle partial card number", () => {
      expect(formatCardNumber("41111")).toBe("4111 1");
    });

    it("should handle empty string", () => {
      expect(formatCardNumber("")).toBe("");
    });
  });

  describe("formatExpiry", () => {
    it("should return digits only for 2 or fewer digits", () => {
      expect(formatExpiry("12")).toBe("12");
    });

    it("should format with slash for 3+ digits", () => {
      expect(formatExpiry("1225")).toBe("12/25");
    });

    it("should strip non-digit characters", () => {
      expect(formatExpiry("12/25")).toBe("12/25");
    });

    it("should truncate beyond 4 digits", () => {
      expect(formatExpiry("12256")).toBe("12/25");
    });

    it("should handle empty string", () => {
      expect(formatExpiry("")).toBe("");
    });

    it("should handle single digit", () => {
      expect(formatExpiry("1")).toBe("1");
    });
  });

  describe("formatCpfCnpj", () => {
    it("should return digits only for 3 or fewer digits", () => {
      expect(formatCpfCnpj("123")).toBe("123");
    });

    it("should format CPF with first dot for 4-6 digits", () => {
      expect(formatCpfCnpj("1234")).toBe("123.4");
      expect(formatCpfCnpj("123456")).toBe("123.456");
    });

    it("should format CPF with two dots for 7-9 digits", () => {
      expect(formatCpfCnpj("1234567")).toBe("123.456.7");
      expect(formatCpfCnpj("123456789")).toBe("123.456.789");
    });

    it("should format full CPF with dots and hyphen", () => {
      expect(formatCpfCnpj("12345678901")).toBe("123.456.789-01");
    });

    it("should format CNPJ with dots, slash, and hyphen", () => {
      expect(formatCpfCnpj("12345678000195")).toBe("12.345.678/0001-95");
    });

    it("should format partial CNPJ (12 digits)", () => {
      expect(formatCpfCnpj("123456780001")).toBe("12.345.678/0001");
    });

    it("should strip non-digit characters", () => {
      expect(formatCpfCnpj("123.456.789-01")).toBe("123.456.789-01");
    });

    it("should truncate beyond 14 digits", () => {
      expect(formatCpfCnpj("123456780001951")).toBe("12.345.678/0001-95");
    });

    it("should handle empty string", () => {
      expect(formatCpfCnpj("")).toBe("");
    });
  });

  describe("formatCurrency", () => {
    it("should format integer value", () => {
      expect(formatCurrency(100)).toBe("R$100,00");
    });

    it("should format decimal value", () => {
      expect(formatCurrency(49.9)).toBe("R$49,90");
    });

    it("should format zero", () => {
      expect(formatCurrency(0)).toBe("R$0,00");
    });

    it("should round to 2 decimal places", () => {
      expect(formatCurrency(10.999)).toBe("R$11,00");
    });

    it("should format negative value", () => {
      expect(formatCurrency(-5.5)).toBe("R$-5,50");
    });
  });
});
