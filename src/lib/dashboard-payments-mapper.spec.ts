import { vi, describe, it, expect } from "vitest";

vi.mock("@/lib/payment-format", () => ({
  formatPaymentMethod: (p: { method: string }) => (p.method === "PIX" ? "PIX" : "Cartão"),
  formatPaymentAmount: (amount: number) => `R$ ${(amount / 100).toFixed(2)}`,
}));

vi.mock("@/lib/payment-status-map", () => ({
  resolvePaymentStatus: (status: string) => ({
    status: status === "PAID" ? "success" : "pending",
    label: status === "PAID" ? "Pago" : "Pendente",
  }),
}));

const { mapCardsToPanel, mapPaymentsToPanel } = await import("./dashboard-payments-mapper");

describe("mapCardsToPanel", () => {
  it("should map card with known brand to correct icon", () => {
    const cards = [
      { id: 1, brand: "VISA", lastFourDigits: "1234", expiryMonth: 3, expiryYear: 2028 },
    ] as never[];

    const result = mapCardsToPanel(cards);

    expect(result).toEqual([
      { id: 1, brandSrc: "/icons/Visa.svg", lastDigits: "1234", expiry: "03/2028" },
    ]);
  });

  it("should map each brand to its specific icon", () => {
    const brands = [
      { brand: "VISA", expected: "/icons/Visa.svg" },
      { brand: "MASTERCARD", expected: "/icons/master-card-icon.svg" },
      { brand: "AMEX", expected: "/icons/Amex.svg" },
      { brand: "ELO", expected: "/icons/Elo.svg" },
      { brand: "HIPERCARD", expected: "/icons/Hipercard.svg" },
    ];

    for (const { brand, expected } of brands) {
      const cards = [
        { id: 1, brand, lastFourDigits: "0000", expiryMonth: 1, expiryYear: 2027 },
      ] as never[];
      const result = mapCardsToPanel(cards);
      expect(result[0].brandSrc).toBe(expected);
    }
  });

  it("should use fallback icon for unknown brand", () => {
    const cards = [
      { id: 1, brand: "UNKNOWN", lastFourDigits: "9999", expiryMonth: 12, expiryYear: 2027 },
    ] as never[];

    const result = mapCardsToPanel(cards);

    expect(result[0].brandSrc).toBe("/icons/master-card-icon.svg");
  });

  it("should pad single-digit month", () => {
    const cards = [
      { id: 1, brand: "VISA", lastFourDigits: "1234", expiryMonth: 1, expiryYear: 2027 },
    ] as never[];

    const result = mapCardsToPanel(cards);

    expect(result[0].expiry).toBe("01/2027");
  });

  it("should return empty array for empty input", () => {
    expect(mapCardsToPanel([])).toEqual([]);
  });
});

describe("mapPaymentsToPanel", () => {
  const basePayment = {
    id: 1,
    method: "CREDIT_CARD",
    status: "PAID",
    amount: 15000,
    appointment: { service: { name: "Faxina" } },
  };

  it("should map payment with card method", () => {
    const result = mapPaymentsToPanel([basePayment] as never[]);

    expect(result[0]).toEqual({
      id: 1,
      method: "card",
      methodLabel: "Cartão",
      service: "Faxina",
      amount: "R$ 150.00",
      status: "success",
      statusLabel: "Pago",
    });
  });

  it("should map PIX payment method", () => {
    const result = mapPaymentsToPanel([{ ...basePayment, method: "PIX" }] as never[]);

    expect(result[0].method).toBe("pix");
    expect(result[0].methodLabel).toBe("PIX");
  });

  it("should map pending status", () => {
    const result = mapPaymentsToPanel([{ ...basePayment, status: "PENDING" }] as never[]);

    expect(result[0].status).toBe("pending");
    expect(result[0].statusLabel).toBe("Pendente");
  });

  it("should return empty array for empty input", () => {
    expect(mapPaymentsToPanel([])).toEqual([]);
  });
});
