import { describe, it, expect } from "vitest";

import { SchedulingPricing } from "./scheduling-pricing";

const base = {
  basePrice: 150,
  recurrenceType: null,
  recurrenceFrequency: null,
  weeklyFrequency: 1,
  serviceFee: 3,
} as const;

describe("SchedulingPricing.calculate", () => {
  it("charges base price once with no discount for single (avulso)", () => {
    expect(SchedulingPricing.calculate({ ...base, recurrenceType: "avulso" })).toEqual({
      subtotal: 150,
      discount: 0,
      total: 153,
    });
  });

  it("applies 10% discount for weekly 1x", () => {
    expect(
      SchedulingPricing.calculate({
        ...base,
        recurrenceType: "recorrencia",
        recurrenceFrequency: "semanal",
        weeklyFrequency: 1,
      }),
    ).toEqual({ subtotal: 150, discount: 15, total: 138 });
  });

  it("multiplies by weekly frequency and discounts the total (weekly 3x)", () => {
    expect(
      SchedulingPricing.calculate({
        ...base,
        recurrenceType: "recorrencia",
        recurrenceFrequency: "semanal",
        weeklyFrequency: 3,
      }),
    ).toEqual({ subtotal: 450, discount: 45, total: 408 });
  });

  it("ignores weekly frequency for biweekly (10% on single base)", () => {
    expect(
      SchedulingPricing.calculate({
        ...base,
        recurrenceType: "recorrencia",
        recurrenceFrequency: "quinzenal",
        weeklyFrequency: 3,
      }),
    ).toEqual({ subtotal: 150, discount: 15, total: 138 });
  });

  it("applies 5% discount for monthly", () => {
    expect(
      SchedulingPricing.calculate({
        ...base,
        recurrenceType: "recorrencia",
        recurrenceFrequency: "mensal",
        weeklyFrequency: 3,
      }),
    ).toEqual({ subtotal: 150, discount: 7.5, total: 145.5 });
  });
});
