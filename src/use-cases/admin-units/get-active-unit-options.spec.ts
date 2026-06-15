import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin/admin-appointments-api", () => ({
  AdminAppointmentsApi: { fetchUnits: vi.fn() },
}));

vi.mock("@/lib/core/messages", () => ({
  Messages: { adminAppointments: { unitsError: "Units error" } },
}));

const api = await import("@/api/admin/admin-appointments-api");
const { GetActiveUnitOptions } = await import("./get-active-unit-options");

describe("getActiveUnitOptions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return only active units", async () => {
    vi.mocked(api.AdminAppointmentsApi.fetchUnits).mockResolvedValue([
      { id: 1, name: "Centro", isActive: true },
      { id: 2, name: "Fechada", isActive: false },
    ]);

    const result = await GetActiveUnitOptions.getActiveUnitOptions();

    expect(result.data).toEqual([{ id: 1, name: "Centro" }]);
    expect(result.error).toBeNull();
  });

  it("should return error on API failure", async () => {
    vi.mocked(api.AdminAppointmentsApi.fetchUnits).mockRejectedValue(new Error("fail"));

    const result = await GetActiveUnitOptions.getActiveUnitOptions();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Units error");
  });
});
