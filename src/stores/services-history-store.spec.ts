import { describe, it, expect, beforeEach } from "vitest";

import { useServicesHistoryStore } from "./services-history-store";

describe("ServicesHistoryStore", () => {
  beforeEach(() => {
    useServicesHistoryStore.getState().reset();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useServicesHistoryStore.getState();

      expect(state.filter).toBe("all");
      expect(state.currentPage).toBe(1);
    });
  });

  describe("setFilter", () => {
    it("should update filter and reset page to 1", () => {
      useServicesHistoryStore.setState({ currentPage: 5 });

      useServicesHistoryStore.getState().setFilter("recurrence");

      const state = useServicesHistoryStore.getState();
      expect(state.filter).toBe("recurrence");
      expect(state.currentPage).toBe(1);
    });

    it("should set filter to one_time", () => {
      useServicesHistoryStore.getState().setFilter("one_time");
      expect(useServicesHistoryStore.getState().filter).toBe("one_time");
    });
  });

  describe("setCurrentPage", () => {
    it("should update currentPage", () => {
      useServicesHistoryStore.getState().setCurrentPage(3);
      expect(useServicesHistoryStore.getState().currentPage).toBe(3);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useServicesHistoryStore.setState({
        filter: "recurrence",
        currentPage: 10,
      });

      useServicesHistoryStore.getState().reset();

      const state = useServicesHistoryStore.getState();
      expect(state.filter).toBe("all");
      expect(state.currentPage).toBe(1);
    });
  });
});
