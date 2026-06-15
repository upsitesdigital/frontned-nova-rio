import { describe, it, expect } from "vitest";
import { AppointmentLabels } from "./appointment-labels";

describe("appointment-labels", () => {
  describe("AppointmentLabels.getStatusLabel", () => {
    it("should return 'Agendado' for SCHEDULED", () => {
      expect(AppointmentLabels.getStatusLabel("SCHEDULED")).toBe("Agendado");
    });

    it("should return 'Concluído' for COMPLETED", () => {
      expect(AppointmentLabels.getStatusLabel("COMPLETED")).toBe("Concluído");
    });

    it("should return 'Cancelado' for CANCELLED", () => {
      expect(AppointmentLabels.getStatusLabel("CANCELLED")).toBe("Cancelado");
    });

    it("should return raw status for unknown value", () => {
      expect(AppointmentLabels.getStatusLabel("UNKNOWN")).toBe("UNKNOWN");
    });
  });

  describe("AppointmentLabels.getStatusVariant", () => {
    it("should return 'pending' for SCHEDULED", () => {
      expect(AppointmentLabels.getStatusVariant("SCHEDULED")).toBe("pending");
    });

    it("should return 'approved' for COMPLETED", () => {
      expect(AppointmentLabels.getStatusVariant("COMPLETED")).toBe("approved");
    });

    it("should return 'cancelled' for CANCELLED", () => {
      expect(AppointmentLabels.getStatusVariant("CANCELLED")).toBe("cancelled");
    });

    it("should return 'pending' for unknown value", () => {
      expect(AppointmentLabels.getStatusVariant("OTHER")).toBe("pending");
    });
  });

  describe("AppointmentLabels.getRecurrenceLabel", () => {
    it("should return 'Avulso' for SINGLE", () => {
      expect(AppointmentLabels.getRecurrenceLabel("SINGLE")).toBe("Avulso");
    });

    it("should return 'Pacote' for PACKAGE", () => {
      expect(AppointmentLabels.getRecurrenceLabel("PACKAGE")).toBe("Pacote");
    });

    it("should return 'Recorrência Semanal' for WEEKLY", () => {
      expect(AppointmentLabels.getRecurrenceLabel("WEEKLY")).toBe("Recorrência Semanal");
    });

    it("should return 'Recorrência Quinzenal' for BIWEEKLY", () => {
      expect(AppointmentLabels.getRecurrenceLabel("BIWEEKLY")).toBe("Recorrência Quinzenal");
    });

    it("should return 'Recorrência Mensal' for MONTHLY", () => {
      expect(AppointmentLabels.getRecurrenceLabel("MONTHLY")).toBe("Recorrência Mensal");
    });

    it("should return raw value for unknown recurrence type", () => {
      expect(AppointmentLabels.getRecurrenceLabel("CUSTOM")).toBe("CUSTOM");
    });
  });

  describe("AppointmentLabels.getStatusIcon", () => {
    it("should return a component for known statuses", () => {
      expect(AppointmentLabels.getStatusIcon("COMPLETED")).toBeDefined();
      expect(AppointmentLabels.getStatusIcon("SCHEDULED")).toBeDefined();
      expect(AppointmentLabels.getStatusIcon("CANCELLED")).toBeDefined();
    });

    it("should return fallback icon for unknown status", () => {
      expect(AppointmentLabels.getStatusIcon("OTHER")).toBeDefined();
    });
  });

  describe("AppointmentLabels.formatAppointmentDate", () => {
    it("should format valid ISO date to dd/MM/yyyy", () => {
      expect(AppointmentLabels.formatAppointmentDate("2026-03-15")).toBe("15/03/2026");
    });

    it("should return placeholder for invalid date", () => {
      expect(AppointmentLabels.formatAppointmentDate("invalid")).toBe("--/--/----");
    });
  });

  describe("AppointmentLabels.formatDurationTime", () => {
    it("should format duration and start time", () => {
      expect(AppointmentLabels.formatDurationTime(50, "16:00")).toBe("50 min | 16:00H");
    });

    it("should format single digit duration", () => {
      expect(AppointmentLabels.formatDurationTime(5, "09:00")).toBe("5 min | 09:00H");
    });
  });
});
