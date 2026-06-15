import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin/admin-appointments-api", () => ({
  AdminAppointmentsApi: { fetchAdminServices: vi.fn() },
}));

vi.mock("@/lib/core/messages", () => ({
  Messages: { adminAppointments: { servicesError: "Services error" } },
}));

const api = await import("@/api/admin/admin-appointments-api");
const { GetAdminServiceOptions } = await import("./get-admin-service-options");

describe("getAdminServiceOptions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return only active services with capability flags", async () => {
    vi.mocked(api.AdminAppointmentsApi.fetchAdminServices).mockResolvedValue([
      {
        id: 1,
        name: "Faxina",
        isActive: true,
        allowSingle: true,
        allowPackage: false,
        allowRecurrence: true,
      },
      {
        id: 2,
        name: "Inativo",
        isActive: false,
        allowSingle: true,
        allowPackage: true,
        allowRecurrence: false,
      },
    ]);

    const result = await GetAdminServiceOptions.getAdminServiceOptions();

    expect(result.data).toEqual([
      { id: 1, name: "Faxina", allowSingle: true, allowPackage: false, allowRecurrence: true },
    ]);
    expect(result.error).toBeNull();
  });

  it("should return error on API failure", async () => {
    vi.mocked(api.AdminAppointmentsApi.fetchAdminServices).mockRejectedValue(new Error("fail"));

    const result = await GetAdminServiceOptions.getAdminServiceOptions();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Services error");
  });
});
