import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-appointments-api", () => ({
  fetchEmployees: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminAppointments: { employeesError: "Employees error" } },
}));

const api = await import("@/api/admin-appointments-api");
const { getActiveEmployeeOptions } = await import("./get-active-employee-options");

describe("getActiveEmployeeOptions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return only active employees", async () => {
    vi.mocked(api.fetchEmployees).mockResolvedValue([
      { id: 1, name: "Carlos", isActive: true },
      { id: 2, name: "Inativo", isActive: false },
      { id: 3, name: "Ana", isActive: true },
    ]);

    const result = await getActiveEmployeeOptions();

    expect(result.data).toEqual([
      { id: 1, name: "Carlos" },
      { id: 3, name: "Ana" },
    ]);
    expect(result.error).toBeNull();
  });

  it("should return empty array when all are inactive", async () => {
    vi.mocked(api.fetchEmployees).mockResolvedValue([
      { id: 1, name: "Inativo", isActive: false },
    ]);

    const result = await getActiveEmployeeOptions();

    expect(result.data).toEqual([]);
  });

  it("should return error on API failure", async () => {
    vi.mocked(api.fetchEmployees).mockRejectedValue(new Error("Network error"));

    const result = await getActiveEmployeeOptions();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Employees error");
  });
});
