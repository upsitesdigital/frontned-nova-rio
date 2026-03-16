import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpGet: vi.fn(),
}));

const { httpGet } = await import("./http-client");

import { fetchPublicServices } from "./services-api";

describe("services-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchPublicServices", () => {
    it("should call httpGet with /services/public?limit=50", async () => {
      vi.mocked(httpGet).mockResolvedValue({ data: [] });

      await fetchPublicServices();

      expect(httpGet).toHaveBeenCalledWith("/services/public?limit=50");
    });

    it("should convert basePrice strings to numbers", async () => {
      vi.mocked(httpGet).mockResolvedValue({
        data: [
          { id: 1, name: "Limpeza", basePrice: "150.00" },
          { id: 2, name: "Jardinagem", basePrice: "200.50" },
        ],
      });

      const result = await fetchPublicServices();

      expect(result[0].basePrice).toBe(150);
      expect(result[1].basePrice).toBe(200.5);
    });

    it("should preserve all service fields besides basePrice conversion", async () => {
      vi.mocked(httpGet).mockResolvedValue({
        data: [
          {
            id: 3,
            uuid: "abc-123",
            name: "Passadoria",
            description: "Serv. de passar roupas",
            icon: "iron",
            basePrice: "80",
            allowSingle: true,
            allowPackage: false,
            allowRecurrence: true,
            isActive: true,
            createdAt: "2026-01-01",
            updatedAt: "2026-02-01",
          },
        ],
      });

      const result = await fetchPublicServices();

      expect(result).toEqual([
        {
          id: 3,
          uuid: "abc-123",
          name: "Passadoria",
          description: "Serv. de passar roupas",
          icon: "iron",
          basePrice: 80,
          allowSingle: true,
          allowPackage: false,
          allowRecurrence: true,
          isActive: true,
          createdAt: "2026-01-01",
          updatedAt: "2026-02-01",
        },
      ]);
    });

    it("should return empty array when API returns no services", async () => {
      vi.mocked(httpGet).mockResolvedValue({ data: [] });

      const result = await fetchPublicServices();

      expect(result).toEqual([]);
    });
  });
});
