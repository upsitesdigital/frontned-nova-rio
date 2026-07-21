import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/use-cases/client-appointments/reschedule-client-appointment", () => ({
  RescheduleClientAppointment: {
    rescheduleClientAppointment: vi.fn(),
  },
}));

vi.mock("@/use-cases/client-appointments/cancel-client-appointment", () => ({
  CancelClientAppointment: {
    cancelClientAppointment: vi.fn(),
  },
}));

vi.mock("@/api/client/receipts-api", () => ({
  ReceiptsApi: { fetchReceiptBlob: vi.fn() },
}));

vi.mock("@/lib/core/download-helpers", () => ({
  DownloadHelpers: { triggerBlobDownload: vi.fn() },
}));

vi.mock("@/lib/core/messages", () => ({
  Messages: {
    appointments: {
      selectDateTime: "Selecione a data e o horario.",
      rescheduleSuccess: "Agendamento atualizado!",
      rescheduleError: "Erro ao reagendar.",
      cancelSuccess: "Agendamento cancelado!",
      cancelError: "Erro ao cancelar.",
    },
  },
}));

const { RescheduleClientAppointment } =
  await import("@/use-cases/client-appointments/reschedule-client-appointment");
const { CancelClientAppointment } =
  await import("@/use-cases/client-appointments/cancel-client-appointment");
const { ReceiptsApi } = await import("@/api/client/receipts-api");
const { DownloadHelpers } = await import("@/lib/core/download-helpers");

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
    it("should save address/recurrence without requiring date or time", async () => {
      vi.mocked(RescheduleClientAppointment.rescheduleClientAppointment).mockResolvedValue({
        success: true,
        error: null,
      });
      useServiceEditStore.setState({
        rescheduleDate: undefined,
        rescheduleTime: undefined,
        recurrence: "MONTHLY",
        locationZip: "22640-102",
        locationAddress: "Rua Teste, 1",
      });

      const result = await useServiceEditStore.getState().confirmReschedule(1);

      expect(result).toBe(true);
      expect(RescheduleClientAppointment.rescheduleClientAppointment).toHaveBeenCalledWith({
        appointmentId: 1,
        date: undefined,
        time: undefined,
        recurrenceType: "MONTHLY",
        locationZip: "22640-102",
        locationAddress: "Rua Teste, 1",
      });
    });

    it("should reschedule and close panel on success", async () => {
      const date = new Date(2026, 5, 15);
      vi.mocked(RescheduleClientAppointment.rescheduleClientAppointment).mockResolvedValue({
        success: true,
        error: null,
      });
      useServiceEditStore.setState({
        rescheduleDate: date,
        rescheduleTime: "10:00",
      });

      const result = await useServiceEditStore.getState().confirmReschedule(1);

      expect(result).toBe(true);
      expect(RescheduleClientAppointment.rescheduleClientAppointment).toHaveBeenCalledWith({
        appointmentId: 1,
        date,
        time: "10:00",
        recurrenceType: "SINGLE",
        locationZip: undefined,
        locationAddress: undefined,
      });
      const state = useServiceEditStore.getState();
      expect(state.rescheduleOpen).toBe(false);
      expect(state.rescheduleDate).toBeUndefined();
      expect(state.rescheduleTime).toBeUndefined();
      expect(state.saveSuccess).toBe("Agendamento atualizado!");
      expect(state.isSaving).toBe(false);
    });

    it("should set error on failure", async () => {
      vi.mocked(RescheduleClientAppointment.rescheduleClientAppointment).mockResolvedValue({
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
      vi.mocked(CancelClientAppointment.cancelClientAppointment).mockResolvedValue({
        success: true,
        error: null,
      });

      const result = await useServiceEditStore.getState().confirmCancel(1);

      expect(result).toBe(true);
      expect(CancelClientAppointment.cancelClientAppointment).toHaveBeenCalledWith(1);
      const state = useServiceEditStore.getState();
      expect(state.cancelOpen).toBe(false);
      expect(state.saveSuccess).toBe("Agendamento cancelado!");
      expect(state.isSaving).toBe(false);
    });

    it("should set error on failure", async () => {
      vi.mocked(CancelClientAppointment.cancelClientAppointment).mockResolvedValue({
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
      vi.mocked(ReceiptsApi.fetchReceiptBlob).mockResolvedValue(blob);

      await useServiceEditStore.getState().downloadServiceReceipt(42);

      expect(ReceiptsApi.fetchReceiptBlob).toHaveBeenCalledWith(42);
      expect(DownloadHelpers.triggerBlobDownload).toHaveBeenCalledWith(blob, "recibo-42.pdf");
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
