import type { RecurrenceFrequencyCode } from "@/api/client/profile-api";
import type { RecurrenceFrequency } from "@/types/scheduling";

/**
 * Translates between the backend recurrence enum (WEEKLY/BIWEEKLY/MONTHLY) used
 * by the API and the Portuguese booking-flow frequency (semanal/quinzenal/mensal).
 */
class RecurrenceMapping {
  private static readonly codeToFrequency: Record<RecurrenceFrequencyCode, RecurrenceFrequency> = {
    WEEKLY: "semanal",
    BIWEEKLY: "quinzenal",
    MONTHLY: "mensal",
  };

  private static readonly frequencyToCode: Record<RecurrenceFrequency, RecurrenceFrequencyCode> = {
    semanal: "WEEKLY",
    quinzenal: "BIWEEKLY",
    mensal: "MONTHLY",
  };

  static toFrequency(code: RecurrenceFrequencyCode): RecurrenceFrequency {
    return RecurrenceMapping.codeToFrequency[code];
  }

  static toCode(frequency: RecurrenceFrequency): RecurrenceFrequencyCode {
    return RecurrenceMapping.frequencyToCode[frequency];
  }
}

export { RecurrenceMapping };
