import type { RecurrenceFrequency, RecurrenceType } from "@/types/scheduling";

interface SchedulingPricingInput {
  basePrice: number;
  recurrenceType: RecurrenceType | null;
  recurrenceFrequency: RecurrenceFrequency | null;
  weeklyFrequency: number;
  serviceFee: number;
}

interface SchedulingPricingResult {
  subtotal: number;
  discount: number;
  total: number;
}

/**
 * Mirrors the backend pricing rules (prisma-payment-pricing.service):
 * - Discount is based on monthly visits, with the discounted unit price rounded first.
 */
class SchedulingPricing {
  static calculate(input: SchedulingPricingInput): SchedulingPricingResult {
    const monthlyVisits = SchedulingPricing.resolveMonthlyVisits(input);
    const discountRate = SchedulingPricing.resolveDiscountRate(monthlyVisits);
    const discountedUnitPrice = Number((input.basePrice * (1 - discountRate)).toFixed(2));
    const subtotal = input.basePrice * monthlyVisits;
    const discount = subtotal - discountedUnitPrice * monthlyVisits;
    const total = subtotal - discount + input.serviceFee;

    return { subtotal, discount, total };
  }

  private static resolveMonthlyVisits(input: SchedulingPricingInput): number {
    if (input.recurrenceType !== "recorrencia") return 1;
    if (input.recurrenceFrequency === "quinzenal") return input.weeklyFrequency * 2;
    if (input.recurrenceFrequency === "mensal") return input.weeklyFrequency;
    if (input.recurrenceFrequency !== "semanal") return 1;
    if (input.weeklyFrequency === 1) return 4;
    if (input.weeklyFrequency === 2) return 8;
    if (input.weeklyFrequency === 3) return 13;
    if (input.weeklyFrequency === 4) return 17;
    return 21;
  }

  private static resolveDiscountRate(monthlyVisits: number): number {
    if (monthlyVisits >= 21) return 0.1;
    if (monthlyVisits >= 17) return 0.09;
    if (monthlyVisits >= 13) return 0.08;
    if (monthlyVisits >= 8) return 0.07;
    if (monthlyVisits >= 4) return 0.05;
    if (monthlyVisits >= 2) return 0.03;

    return 0;
  }
}

export { SchedulingPricing, type SchedulingPricingInput, type SchedulingPricingResult };
