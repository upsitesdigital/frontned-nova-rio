import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-dashboard-api", () => ({
  fetchAdminDashboardServices: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminAppointments: { optionsError: "Options error" } },
}));

const api = await import("@/api/admin-dashboard-api");
const { getActiveServiceOptions } = await import("./get-active-service-options");

describe("getActiveServiceOptions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return only active services with id and name", async () => {
    vi.mocked(api.fetchAdminDashboardServices).mockResolvedValue([
      { id: 1, name: "Limpeza", isActive: true },
      { id: 2, name: "Inativo", isActive: false },
      { id: 3, name: "Jardinagem", isActive: true },
    ]);

    const result = await getActiveServiceOptions();

    expect(result.data).toEqual([
      { id: 1, name: "Limpeza" },
      { id: 3, name: "Jardinagem" },
    ]);
    expect(result.error).toBeNull();
  });

  it("should return error on API failure", async () => {
    vi.mocked(api.fetchAdminDashboardServices).mockRejectedValue(new Error("fail"));

    const result = await getActiveServiceOptions();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Options error");
  });
});
