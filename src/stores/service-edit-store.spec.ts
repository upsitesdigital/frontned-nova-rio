import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/reschedule-client-appointment", () => ({
  rescheduleClientAppointment: vi.fn(),
}));

vi.mock("@/use-cases/cancel-client-appointment", () => ({
  cancelClientAppointment: vi.fn(),
}));

vi.mock("@/api/receipts-api", () => ({
  fetchReceiptBlob: vi.fn(),
}));

vi.mock("@/lib/download-helpers", () => ({
  triggerBlobDownload: vi.fn(),
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
const { fetchReceiptBlob } = await import("@/api/receipts-api");
const { triggerBlobDownload } = await import("@/lib/download-helpers");

import { useServiceEditStore } from "./service-edit-store";

describe("ServiceEditStore", () => {
  beforeEach(() => {
    useServiceEditStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useServiceEditStore.getState();

      expect(state.recurrence).toBe("SINGLE");
      expect(state.addressSectionOpen).toBe(true);
      expect(state.rescheduleOpen).toBe(false);
      expect(state.rescheduleDate).toBeUndefined();
      expect(state.rescheduleTime).toBeUndefined();
      expect(state.cancelOpen).toBe(false);
      expect(state.isSaving).toBe(false);
      expect(state.saveError).toBeNull();
      expect(state.saveSuccess).toBeNull();
    });
  });

  describe("setAddressSectionOpen", () => {
    it("should toggle addressSectionOpen", () => {
      useServiceEditStore.getState().setAddressSectionOpen(false);
      expect(useServiceEditStore.getState().addressSectionOpen).toBe(false);
    });
  });

  describe("setRecurrence / initRecurrence", () => {
    it("should update recurrence via setRecurrence", () => {
      useServiceEditStore.getState().setRecurrence("MONTHLY");
      expect(useServiceEditStore.getState().recurrence).toBe("MONTHLY");
    });

    it("should update recurrence via initRecurrence", () => {
      useServiceEditStore.getState().initRecurrence("WEEKLY");
      expect(useServiceEditStore.getState().recurrence).toBe("WEEKLY");
    });
  });

  describe("openReschedule / closeReschedule", () => {
    it("should open reschedule with provided date and time", () => {
      const date = new Date(2026, 5, 15);

      useServiceEditStore.getState().openReschedule(date, "10:00");

      const state = useServiceEditStore.getState();
      expect(state.rescheduleOpen).toBe(true);
      expect(state.rescheduleDate).toEqual(date);
      expect(state.rescheduleTime).toBe("10:00");
    });

    it("should default to new Date when no date provided", () => {
      useServiceEditStore.getState().openReschedule();

      const state = useServiceEditStore.getState();
      expect(state.rescheduleOpen).toBe(true);
      expect(state.rescheduleDate).toBeInstanceOf(Date);
      expect(state.rescheduleTime).toBeUndefined();
    });

    it("should close reschedule panel", () => {
      useServiceEditStore.setState({ rescheduleOpen: true });

      useServiceEditStore.getState().closeReschedule();

      expect(useServiceEditStore.getState().rescheduleOpen).toBe(false);
    });
  });

  describe("setRescheduleDate / setRescheduleTime", () => {
    it("should update rescheduleDate", () => {
      const date = new Date(2026, 6, 1);
      useServiceEditStore.getState().setRescheduleDate(date);
      expect(useServiceEditStore.getState().rescheduleDate).toEqual(date);
    });

    it("should update rescheduleTime", () => {
      useServiceEditStore.getState().setRescheduleTime("14:30");
      expect(useServiceEditStore.getState().rescheduleTime).toBe("14:30");
    });
  });

  describe("confirmReschedule", () => {
    it("should return false and set error when date or time is missing", async () => {
      useServiceEditStore.setState({ rescheduleDate: undefined, rescheduleTime: undefined });

      const result = await useServiceEditStore.getState().confirmReschedule(1);

      expect(result).toBe(false);
      expect(useServiceEditStore.getState().saveError).toBe("Selecione a data e o horario.");
    });

    it("should reschedule and close panel on success", async () => {
      const date = new Date(2026, 5, 15);
      vi.mocked(rescheduleClientAppointment).mockResolvedValue({
        success: true,
        error: null,
      });
      useServiceEditStore.setState({
        rescheduleDate: date,
        rescheduleTime: "10:00",
      });

      const result = await useServiceEditStore.getState().confirmReschedule(1);

      expect(result).toBe(true);
      expect(rescheduleClientAppointment).toHaveBeenCalledWith({
        appointmentId: 1,
        date,
        time: "10:00",
      });
      const state = useServiceEditStore.getState();
      expect(state.rescheduleOpen).toBe(false);
      expect(state.rescheduleDate).toBeUndefined();
      expect(state.rescheduleTime).toBeUndefined();
      expect(state.saveSuccess).toBe("Agendamento atualizado!");
      expect(state.isSaving).toBe(false);
    });

    it("should set error on failure", async () => {
      vi.mocked(rescheduleClientAppointment).mockResolvedValue({
        success: false,
        error: "Reschedule error",
      });
      useServiceEditStore.setState({
        rescheduleDate: new Date(),
        rescheduleTime: "10:00",
      });

      const result = await useServiceEditStore.getState().confirmReschedule(1);

      expect(result).toBe(false);
      expect(useServiceEditStore.getState().saveError).toBe("Reschedule error");
      expect(useServiceEditStore.getState().isSaving).toBe(false);
    });
  });

  describe("openCancel / closeCancel", () => {
    it("should open cancel panel and clear error", () => {
      useServiceEditStore.setState({ saveError: "old error" });

      useServiceEditStore.getState().openCancel();

      const state = useServiceEditStore.getState();
      expect(state.cancelOpen).toBe(true);
      expect(state.saveError).toBeNull();
    });

    it("should close cancel panel", () => {
      useServiceEditStore.setState({ cancelOpen: true });

      useServiceEditStore.getState().closeCancel();

      expect(useServiceEditStore.getState().cancelOpen).toBe(false);
    });
  });

  describe("confirmCancel", () => {
    it("should cancel and close panel on success", async () => {
      vi.mocked(cancelClientAppointment).mockResolvedValue({
        success: true,
        error: null,
      });

      const result = await useServiceEditStore.getState().confirmCancel(1);

      expect(result).toBe(true);
      expect(cancelClientAppointment).toHaveBeenCalledWith(1);
      const state = useServiceEditStore.getState();
      expect(state.cancelOpen).toBe(false);
      expect(state.saveSuccess).toBe("Agendamento cancelado!");
      expect(state.isSaving).toBe(false);
    });

    it("should set error on failure", async () => {
      vi.mocked(cancelClientAppointment).mockResolvedValue({
        success: false,
        error: "Cancel error",
      });

      const result = await useServiceEditStore.getState().confirmCancel(1);

      expect(result).toBe(false);
      expect(useServiceEditStore.getState().saveError).toBe("Cancel error");
      expect(useServiceEditStore.getState().isSaving).toBe(false);
    });
  });

  describe("downloadServiceReceipt", () => {
    it("should fetch blob and trigger download", async () => {
      const blob = new Blob(["pdf content"]);
      vi.mocked(fetchReceiptBlob).mockResolvedValue(blob);

      await useServiceEditStore.getState().downloadServiceReceipt(42);

      expect(fetchReceiptBlob).toHaveBeenCalledWith(42);
      expect(triggerBlobDownload).toHaveBeenCalledWith(blob, "recibo-42.pdf");
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useServiceEditStore.setState({
        recurrence: "MONTHLY",
        addressSectionOpen: false,
        rescheduleOpen: true,
        rescheduleDate: new Date(),
        rescheduleTime: "10:00",
        cancelOpen: true,
        isSaving: true,
        saveError: "error",
        saveSuccess: "success",
      });

      useServiceEditStore.getState().reset();

      const state = useServiceEditStore.getState();
      expect(state.recurrence).toBe("SINGLE");
      expect(state.addressSectionOpen).toBe(true);
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
