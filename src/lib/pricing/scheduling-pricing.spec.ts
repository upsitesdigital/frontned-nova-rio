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

  it("applies 5% discount for weekly 1x (4 monthly visits)", () => {
    expect(
      SchedulingPricing.calculate({
        ...base,
        recurrenceType: "recorrencia",
        recurrenceFrequency: "semanal",
        weeklyFrequency: 1,
      }),
    ).toEqual({ subtotal: 600, discount: 30, total: 573 });
  });

  it("applies 8% discount for weekly 3x (13 monthly visits)", () => {
    expect(
      SchedulingPricing.calculate({
        ...base,
        recurrenceType: "recorrencia",
        recurrenceFrequency: "semanal",
        weeklyFrequency: 3,
      }),
    ).toEqual({ subtotal: 1950, discount: 156, total: 1797 });
  });

  it("applies 3% discount for biweekly (2 monthly visits)", () => {
    expect(
      SchedulingPricing.calculate({
        ...base,
        recurrenceType: "recorrencia",
        recurrenceFrequency: "quinzenal",
        weeklyFrequency: 1,
      }),
    ).toEqual({ subtotal: 300, discount: 9, total: 294 });
  });

  it("charges one visit for monthly", () => {
    expect(
      SchedulingPricing.calculate({
        ...base,
        recurrenceType: "recorrencia",
        recurrenceFrequency: "mensal",
        weeklyFrequency: 1,
      }),
    ).toEqual({ subtotal: 150, discount: 0, total: 153 });
  });
});
