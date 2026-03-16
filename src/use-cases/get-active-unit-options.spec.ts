import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-appointments-api", () => ({
  fetchUnits: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminAppointments: { unitsError: "Units error" } },
}));

const api = await import("@/api/admin-appointments-api");
const { getActiveUnitOptions } = await import("./get-active-unit-options");

describe("getActiveUnitOptions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return only active units", async () => {
    vi.mocked(api.fetchUnits).mockResolvedValue([
      { id: 1, name: "Centro", isActive: true },
      { id: 2, name: "Fechada", isActive: false },
    ]);

    const result = await getActiveUnitOptions();

    expect(result.data).toEqual([{ id: 1, name: "Centro" }]);
    expect(result.error).toBeNull();
  });

  it("should return error on API failure", async () => {
    vi.mocked(api.fetchUnits).mockRejectedValue(new Error("fail"));

    const result = await getActiveUnitOptions();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Units error");
  });
});
