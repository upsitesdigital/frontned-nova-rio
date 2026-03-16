import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-appointments-api", () => ({
  fetchAdminServices: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminAppointments: { servicesError: "Services error" } },
}));

const api = await import("@/api/admin-appointments-api");
const { getAdminServiceOptions } = await import("./get-admin-service-options");

describe("getAdminServiceOptions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return only active services with capability flags", async () => {
    vi.mocked(api.fetchAdminServices).mockResolvedValue([
      { id: 1, name: "Faxina", isActive: true, allowSingle: true, allowPackage: false, allowRecurrence: true },
      { id: 2, name: "Inativo", isActive: false, allowSingle: true, allowPackage: true, allowRecurrence: false },
    ]);

    const result = await getAdminServiceOptions();

    expect(result.data).toEqual([
      { id: 1, name: "Faxina", allowSingle: true, allowPackage: false, allowRecurrence: true },
    ]);
    expect(result.error).toBeNull();
  });

  it("should return error on API failure", async () => {
    vi.mocked(api.fetchAdminServices).mockRejectedValue(new Error("fail"));

    const result = await getAdminServiceOptions();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Services error");
  });
});
