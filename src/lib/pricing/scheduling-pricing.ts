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
 * - Weekly recurrence multiplies the base price by the chosen times-per-week.
 * - Weekly/biweekly recurrences get 10% off, monthly gets 5%, others none.
 */
class SchedulingPricing {
  private static readonly weeklyDiscountRate = 0.1;
  private static readonly biweeklyDiscountRate = 0.1;
  private static readonly monthlyDiscountRate = 0.05;

  static calculate(input: SchedulingPricingInput): SchedulingPricingResult {
    const isRecurrence = input.recurrenceType === "recorrencia";
    const isWeekly = isRecurrence && input.recurrenceFrequency === "semanal";

    const sessionsPerWeek = isWeekly ? input.weeklyFrequency : 1;
    const subtotal = input.basePrice * sessionsPerWeek;

    const discount = subtotal * SchedulingPricing.resolveDiscountRate(input);
    const total = subtotal - discount + input.serviceFee;

    return { subtotal, discount, total };
  }

  private static resolveDiscountRate(input: SchedulingPricingInput): number {
    if (input.recurrenceType !== "recorrencia") return 0;

    if (input.recurrenceFrequency === "semanal") return SchedulingPricing.weeklyDiscountRate;
    if (input.recurrenceFrequency === "quinzenal") return SchedulingPricing.biweeklyDiscountRate;
    if (input.recurrenceFrequency === "mensal") return SchedulingPricing.monthlyDiscountRate;

    return 0;
  }
}

export { SchedulingPricing, type SchedulingPricingInput, type SchedulingPricingResult };
