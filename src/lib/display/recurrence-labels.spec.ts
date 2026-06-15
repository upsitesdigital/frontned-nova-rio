import { describe, it, expect } from "vitest";
import { RecurrenceLabels } from "./recurrence-labels";

describe("recurrence-labels", () => {
  describe("RecurrenceLabels.resolveRecurrenceLabel", () => {
    it("should return 'Avulso' for SINGLE", () => {
      expect(RecurrenceLabels.resolveRecurrenceLabel("SINGLE")).toBe("Avulso");
    });

    it("should return 'Pacote' for PACKAGE", () => {
      expect(RecurrenceLabels.resolveRecurrenceLabel("PACKAGE")).toBe("Pacote");
    });

    it("should return 'Recorrência Semanal' for WEEKLY", () => {
      expect(RecurrenceLabels.resolveRecurrenceLabel("WEEKLY")).toBe("Recorrência Semanal");
    });

    it("should return 'Recorrência Quinzenal' for BIWEEKLY", () => {
      expect(RecurrenceLabels.resolveRecurrenceLabel("BIWEEKLY")).toBe("Recorrência Quinzenal");
    });

    it("should return 'Recorrência Mensal' for MONTHLY", () => {
      expect(RecurrenceLabels.resolveRecurrenceLabel("MONTHLY")).toBe("Recorrência Mensal");
    });

    it("should return raw value for unknown recurrence type", () => {
      expect(RecurrenceLabels.resolveRecurrenceLabel("DAILY")).toBe("DAILY");
    });

    it("should return empty string for empty input", () => {
      expect(RecurrenceLabels.resolveRecurrenceLabel("")).toBe("");
    });
  });
});
