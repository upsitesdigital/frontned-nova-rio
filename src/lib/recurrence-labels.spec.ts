import { describe, it, expect } from "vitest";
import { resolveRecurrenceLabel } from "./recurrence-labels";

describe("recurrence-labels", () => {
  describe("resolveRecurrenceLabel", () => {
    it("should return 'Avulso' for SINGLE", () => {
      expect(resolveRecurrenceLabel("SINGLE")).toBe("Avulso");
    });

    it("should return 'Pacote' for PACKAGE", () => {
      expect(resolveRecurrenceLabel("PACKAGE")).toBe("Pacote");
    });

    it("should return 'Recorrência Semanal' for WEEKLY", () => {
      expect(resolveRecurrenceLabel("WEEKLY")).toBe("Recorrência Semanal");
    });

    it("should return 'Recorrência Quinzenal' for BIWEEKLY", () => {
      expect(resolveRecurrenceLabel("BIWEEKLY")).toBe("Recorrência Quinzenal");
    });

    it("should return 'Recorrência Mensal' for MONTHLY", () => {
      expect(resolveRecurrenceLabel("MONTHLY")).toBe("Recorrência Mensal");
    });

    it("should return raw value for unknown recurrence type", () => {
      expect(resolveRecurrenceLabel("DAILY")).toBe("DAILY");
    });

    it("should return empty string for empty input", () => {
      expect(resolveRecurrenceLabel("")).toBe("");
    });
  });
});
