import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    get: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { SchedulingApi } from "./scheduling-api";

describe("scheduling-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchTimeSlots", () => {
    it("should call httpGet with date query param", async () => {
      const slots = [
        { time: "08:00", available: true },
        { time: "09:00", available: false },
      ];
      vi.mocked(HttpClient.get).mockResolvedValue(slots);

      const result = await SchedulingApi.fetchTimeSlots("2026-03-20");

      expect(HttpClient.get).toHaveBeenCalledWith("/scheduling/time-slots?date=2026-03-20");
      expect(result).toEqual(slots);
    });
  });

  describe("fetchCoverageByCep", () => {
    it("should call httpGet with clean numeric CEP", async () => {
      const coverage = {
        covered: true,
        address: { cep: "20040020" },
        unitId: 1,
        unitName: "Centro",
      };
      vi.mocked(HttpClient.get).mockResolvedValue(coverage);

      const result = await SchedulingApi.fetchCoverageByCep("20040-020");

      expect(HttpClient.get).toHaveBeenCalledWith("/units/validate-coverage?cep=20040020");
      expect(result).toEqual(coverage);
    });

    it("should strip all non-digit characters from CEP", async () => {
      vi.mocked(HttpClient.get).mockResolvedValue({
        covered: false,
        address: {},
        unitId: null,
        unitName: null,
      });

      await SchedulingApi.fetchCoverageByCep("20.040-020");

      expect(HttpClient.get).toHaveBeenCalledWith("/units/validate-coverage?cep=20040020");
    });

    it("should pass through already-clean CEP unchanged", async () => {
      vi.mocked(HttpClient.get).mockResolvedValue({
        covered: true,
        address: {},
        unitId: 2,
        unitName: "Zona Sul",
      });

      await SchedulingApi.fetchCoverageByCep("22041080");

      expect(HttpClient.get).toHaveBeenCalledWith("/units/validate-coverage?cep=22041080");
    });
  });
});
