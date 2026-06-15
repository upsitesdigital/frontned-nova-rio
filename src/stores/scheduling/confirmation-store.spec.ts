import { describe, it, expect, beforeEach } from "vitest";

import { useConfirmationStore } from "./confirmation-store";

describe("ConfirmationStore", () => {
  beforeEach(() => {
    useConfirmationStore.getState().reset();
  });

  describe("initial state", () => {
    it("should start with confirmation as null", () => {
      expect(useConfirmationStore.getState().confirmation).toBeNull();
    });
  });

  describe("setConfirmation", () => {
    it("should store confirmation data", () => {
      const data = {
        serviceName: "Limpeza",
        date: "2026-03-20",
        startTime: "10:00",
      };

      useConfirmationStore.getState().setConfirmation(data);

      expect(useConfirmationStore.getState().confirmation).toEqual(data);
    });

    it("should overwrite previous confirmation", () => {
      useConfirmationStore.getState().setConfirmation({
        serviceName: "Old",
        date: "2026-01-01",
        startTime: "08:00",
      });

      const newData = {
        serviceName: "New",
        date: "2026-04-01",
        startTime: "14:00",
      };
      useConfirmationStore.getState().setConfirmation(newData);

      expect(useConfirmationStore.getState().confirmation).toEqual(newData);
    });
  });

  describe("reset", () => {
    it("should clear confirmation to null", () => {
      useConfirmationStore.getState().setConfirmation({
        serviceName: "Test",
        date: "2026-03-20",
        startTime: "09:00",
      });

      useConfirmationStore.getState().reset();

      expect(useConfirmationStore.getState().confirmation).toBeNull();
    });
  });
});
