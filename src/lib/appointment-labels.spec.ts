import { describe, it, expect } from "vitest";
import {
  getStatusLabel,
  getStatusVariant,
  getStatusIcon,
  getRecurrenceLabel,
  formatAppointmentDate,
  formatDurationTime,
} from "./appointment-labels";

describe("appointment-labels", () => {
  describe("getStatusLabel", () => {
    it("should return 'Agendado' for SCHEDULED", () => {
      expect(getStatusLabel("SCHEDULED")).toBe("Agendado");
    });

    it("should return 'Concluído' for COMPLETED", () => {
      expect(getStatusLabel("COMPLETED")).toBe("Concluído");
    });

    it("should return 'Cancelado' for CANCELLED", () => {
      expect(getStatusLabel("CANCELLED")).toBe("Cancelado");
    });

    it("should return raw status for unknown value", () => {
      expect(getStatusLabel("UNKNOWN")).toBe("UNKNOWN");
    });
  });

  describe("getStatusVariant", () => {
    it("should return 'pending' for SCHEDULED", () => {
      expect(getStatusVariant("SCHEDULED")).toBe("pending");
    });

    it("should return 'approved' for COMPLETED", () => {
      expect(getStatusVariant("COMPLETED")).toBe("approved");
    });

    it("should return 'cancelled' for CANCELLED", () => {
      expect(getStatusVariant("CANCELLED")).toBe("cancelled");
    });

    it("should return 'pending' for unknown value", () => {
      expect(getStatusVariant("OTHER")).toBe("pending");
    });
  });

  describe("getRecurrenceLabel", () => {
    it("should return 'Avulso' for SINGLE", () => {
      expect(getRecurrenceLabel("SINGLE")).toBe("Avulso");
    });

    it("should return 'Pacote' for PACKAGE", () => {
      expect(getRecurrenceLabel("PACKAGE")).toBe("Pacote");
    });

    it("should return 'Recorrência Semanal' for WEEKLY", () => {
      expect(getRecurrenceLabel("WEEKLY")).toBe("Recorrência Semanal");
    });

    it("should return 'Recorrência Quinzenal' for BIWEEKLY", () => {
      expect(getRecurrenceLabel("BIWEEKLY")).toBe("Recorrência Quinzenal");
    });

    it("should return 'Recorrência Mensal' for MONTHLY", () => {
      expect(getRecurrenceLabel("MONTHLY")).toBe("Recorrência Mensal");
    });

    it("should return raw value for unknown recurrence type", () => {
      expect(getRecurrenceLabel("CUSTOM")).toBe("CUSTOM");
    });
  });

  describe("getStatusIcon", () => {
    it("should return a component for known statuses", () => {
      expect(getStatusIcon("COMPLETED")).toBeDefined();
      expect(getStatusIcon("SCHEDULED")).toBeDefined();
      expect(getStatusIcon("CANCELLED")).toBeDefined();
    });

    it("should return fallback icon for unknown status", () => {
      expect(getStatusIcon("OTHER")).toBeDefined();
    });
  });

  describe("formatAppointmentDate", () => {
    it("should format valid ISO date to dd/MM/yyyy", () => {
      expect(formatAppointmentDate("2026-03-15")).toBe("15/03/2026");
    });

    it("should return placeholder for invalid date", () => {
      expect(formatAppointmentDate("invalid")).toBe("--/--/----");
    });
  });

  describe("formatDurationTime", () => {
    it("should format duration and start time", () => {
      expect(formatDurationTime(50, "16:00")).toBe("50 min | 16:00H");
    });

    it("should format single digit duration", () => {
      expect(formatDurationTime(5, "09:00")).toBe("5 min | 09:00H");
    });
  });
});
