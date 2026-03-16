import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/reschedule-client-appointment", () => ({
  rescheduleClientAppointment: vi.fn(),
}));

vi.mock("@/use-cases/cancel-client-appointment", () => ({
  cancelClientAppointment: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    appointments: {
      selectDateTime: "Selecione a data e o horario.",
      rescheduleSuccess: "Agendamento atualizado!",
      rescheduleError: "Erro ao reagendar.",
      cancelSuccess: "Agendamento cancelado!",
      cancelError: "Erro ao cancelar.",
    },
  },
}));

const { rescheduleClientAppointment } = await import(
  "@/use-cases/reschedule-client-appointment"
);
const { cancelClientAppointment } = await import("@/use-cases/cancel-client-appointment");

import { useSidePanelRescheduleStore } from "./side-panel-reschedule-store";

describe("SidePanelRescheduleStore", () => {
  beforeEach(() => {
    useSidePanelRescheduleStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useSidePanelRescheduleStore.getState();

      expect(state.rescheduleOpen).toBe(false);
      expect(state.rescheduleDate).toBeUndefined();
      expect(state.rescheduleTime).toBeUndefined();
      expect(state.cancelOpen).toBe(false);
      expect(state.isSaving).toBe(false);
      expect(state.saveError).toBeNull();
      expect(state.saveSuccess).toBeNull();
    });
  });

  describe("openReschedule", () => {
    it("should open with provided date and time, clearing error", () => {
      const date = new Date(2026, 5, 15);
      useSidePanelRescheduleStore.setState({ saveError: "old error" });

      useSidePanelRescheduleStore.getState().openReschedule(date, "14:00");

      const state = useSidePanelRescheduleStore.getState();
      expect(state.rescheduleOpen).toBe(true);
      expect(state.rescheduleDate).toEqual(date);
      expect(state.rescheduleTime).toBe("14:00");
      expect(state.saveError).toBeNull();
    });

    it("should default to new Date when no date provided", () => {
      useSidePanelRescheduleStore.getState().openReschedule();

      const state = useSidePanelRescheduleStore.getState();
      expect(state.rescheduleOpen).toBe(true);
      expect(state.rescheduleDate).toBeInstanceOf(Date);
      expect(state.rescheduleTime).toBeUndefined();
    });
  });

  describe("closeReschedule", () => {
    it("should close and clear date/time", () => {
      useSidePanelRescheduleStore.setState({
        rescheduleOpen: true,
        rescheduleDate: new Date(),
        rescheduleTime: "10:00",
      });

      useSidePanelRescheduleStore.getState().closeReschedule();

      const state = useSidePanelRescheduleStore.getState();
      expect(state.rescheduleOpen).toBe(false);
      expect(state.rescheduleDate).toBeUndefined();
      expect(state.rescheduleTime).toBeUndefined();
    });
  });

  describe("setRescheduleDate / setRescheduleTime", () => {
    it("should update rescheduleDate", () => {
      const date = new Date(2026, 6, 1);
      useSidePanelRescheduleStore.getState().setRescheduleDate(date);
      expect(useSidePanelRescheduleStore.getState().rescheduleDate).toEqual(date);
    });

    it("should update rescheduleTime", () => {
      useSidePanelRescheduleStore.getState().setRescheduleTime("16:30");
      expect(useSidePanelRescheduleStore.getState().rescheduleTime).toBe("16:30");
    });
  });

  describe("confirmReschedule", () => {
    it("should return false and set error when date is missing", async () => {
      useSidePanelRescheduleStore.setState({
        rescheduleDate: undefined,
        rescheduleTime: "10:00",
      });

      const result = await useSidePanelRescheduleStore.getState().confirmReschedule(1);

      expect(result).toBe(false);
      expect(useSidePanelRescheduleStore.getState().saveError).toBe(
        "Selecione a data e o horario.",
      );
    });

    it("should return false and set error when time is missing", async () => {
      useSidePanelRescheduleStore.setState({
        rescheduleDate: new Date(),
        rescheduleTime: undefined,
      });

      const result = await useSidePanelRescheduleStore.getState().confirmReschedule(1);

      expect(result).toBe(false);
      expect(useSidePanelRescheduleStore.getState().saveError).toBe(
        "Selecione a data e o horario.",
      );
    });

    it("should reschedule, close panel, and set success on success", async () => {
      const date = new Date(2026, 5, 15);
      vi.mocked(rescheduleClientAppointment).mockResolvedValue({
        success: true,
        error: null,
      });
      useSidePanelRescheduleStore.setState({
        rescheduleDate: date,
        rescheduleTime: "10:00",
      });

      const result = await useSidePanelRescheduleStore.getState().confirmReschedule(1);

      expect(result).toBe(true);
      expect(rescheduleClientAppointment).toHaveBeenCalledWith({
        appointmentId: 1,
        date,
        time: "10:00",
      });
      const state = useSidePanelRescheduleStore.getState();
      expect(state.rescheduleOpen).toBe(false);
      expect(state.rescheduleDate).toBeUndefined();
      expect(state.rescheduleTime).toBeUndefined();
      expect(state.saveSuccess).toBe("Agendamento atualizado!");
      expect(state.isSaving).toBe(false);
    });

    it("should set error on failure", async () => {
      vi.mocked(rescheduleClientAppointment).mockResolvedValue({
        success: false,
        error: "Conflict",
      });
      useSidePanelRescheduleStore.setState({
        rescheduleDate: new Date(),
        rescheduleTime: "10:00",
      });

      const result = await useSidePanelRescheduleStore.getState().confirmReschedule(1);

      expect(result).toBe(false);
      expect(useSidePanelRescheduleStore.getState().saveError).toBe("Conflict");
      expect(useSidePanelRescheduleStore.getState().isSaving).toBe(false);
    });
  });

  describe("openCancel / closeCancel", () => {
    it("should open cancel panel and clear error", () => {
      useSidePanelRescheduleStore.setState({ saveError: "old" });

      useSidePanelRescheduleStore.getState().openCancel();

      const state = useSidePanelRescheduleStore.getState();
      expect(state.cancelOpen).toBe(true);
      expect(state.saveError).toBeNull();
    });

    it("should close cancel panel", () => {
      useSidePanelRescheduleStore.setState({ cancelOpen: true });

      useSidePanelRescheduleStore.getState().closeCancel();

      expect(useSidePanelRescheduleStore.getState().cancelOpen).toBe(false);
    });
  });

  describe("confirmCancel", () => {
    it("should cancel appointment, close panel, and set success", async () => {
      vi.mocked(cancelClientAppointment).mockResolvedValue({
        success: true,
        error: null,
      });

      const result = await useSidePanelRescheduleStore.getState().confirmCancel(1);

      expect(result).toBe(true);
      expect(cancelClientAppointment).toHaveBeenCalledWith(1);
      const state = useSidePanelRescheduleStore.getState();
      expect(state.cancelOpen).toBe(false);
      expect(state.saveSuccess).toBe("Agendamento cancelado!");
      expect(state.isSaving).toBe(false);
    });

    it("should set error on failure", async () => {
      vi.mocked(cancelClientAppointment).mockResolvedValue({
        success: false,
        error: "Cancel failed",
      });

      const result = await useSidePanelRescheduleStore.getState().confirmCancel(1);

      expect(result).toBe(false);
      expect(useSidePanelRescheduleStore.getState().saveError).toBe("Cancel failed");
      expect(useSidePanelRescheduleStore.getState().isSaving).toBe(false);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useSidePanelRescheduleStore.setState({
        rescheduleOpen: true,
        rescheduleDate: new Date(),
        rescheduleTime: "10:00",
        cancelOpen: true,
        isSaving: true,
        saveError: "error",
        saveSuccess: "success",
      });

      useSidePanelRescheduleStore.getState().reset();

      const state = useSidePanelRescheduleStore.getState();
      expect(state.rescheduleOpen).toBe(false);
      expect(state.rescheduleDate).toBeUndefined();
      expect(state.rescheduleTime).toBeUndefined();
      expect(state.cancelOpen).toBe(false);
      expect(state.isSaving).toBe(false);
      expect(state.saveError).toBeNull();
      expect(state.saveSuccess).toBeNull();
    });
  });
});
