import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    authGet: vi.fn(),
    authPatchWithBody: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { AdminEmployeesApi } from "./admin-employees-api";

describe("admin-employees-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAdminEmployees", () => {
    it("should call with page and limit params", async () => {
      const response = { data: [], total: 0, page: 1, limit: 20 };
      vi.mocked(HttpClient.authGet).mockResolvedValue(response);

      await AdminEmployeesApi.fetchAdminEmployees({ page: 1, limit: 20 });

      const url = vi.mocked(HttpClient.authGet).mock.calls[0][0] as string;
      expect(url).toContain("/employees?");
      expect(url).toContain("page=1");
      expect(url).toContain("limit=20");
    });

    it("should include status param when provided", async () => {
      vi.mocked(HttpClient.authGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await AdminEmployeesApi.fetchAdminEmployees({ page: 1, limit: 20, status: "ACTIVE" });

      const url = vi.mocked(HttpClient.authGet).mock.calls[0][0] as string;
      expect(url).toContain("status=ACTIVE");
    });

    it("should include search param when provided", async () => {
      vi.mocked(HttpClient.authGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await AdminEmployeesApi.fetchAdminEmployees({ page: 1, limit: 20, search: "Carlos" });

      const url = vi.mocked(HttpClient.authGet).mock.calls[0][0] as string;
      expect(url).toContain("search=Carlos");
    });

    it("should not include optional params when not provided", async () => {
      vi.mocked(HttpClient.authGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await AdminEmployeesApi.fetchAdminEmployees({ page: 1, limit: 20 });

      const url = vi.mocked(HttpClient.authGet).mock.calls[0][0] as string;
      expect(url).not.toContain("status=");
      expect(url).not.toContain("search=");
    });

    it("should forward AbortSignal", async () => {
      vi.mocked(HttpClient.authGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });
      const controller = new AbortController();

      await AdminEmployeesApi.fetchAdminEmployees({ page: 1, limit: 20 }, controller.signal);

      expect(HttpClient.authGet).toHaveBeenCalledWith(expect.any(String), controller.signal);
    });
  });

  describe("fetchAdminEmployeeById", () => {
    it("should call GET /employees/:id", async () => {
      const employee = { id: 5, name: "Carlos", email: "carlos@test.com" };
      vi.mocked(HttpClient.authGet).mockResolvedValue(employee);

      const result = await AdminEmployeesApi.fetchAdminEmployeeById(5);

      expect(HttpClient.authGet).toHaveBeenCalledWith("/employees/5");
      expect(result).toEqual(employee);
    });
  });

  describe("updateAdminEmployee", () => {
    it("should call PATCH /employees/:id with data", async () => {
      const updated = { id: 5, name: "Carlos Magno", email: "carlos@test.com" };
      vi.mocked(HttpClient.authPatchWithBody).mockResolvedValue(updated);

      const result = await AdminEmployeesApi.updateAdminEmployee(5, { name: "Carlos Magno" });

      expect(HttpClient.authPatchWithBody).toHaveBeenCalledWith("/employees/5", {
        name: "Carlos Magno",
      });
      expect(result).toEqual(updated);
    });

    it("should send all provided fields", async () => {
      vi.mocked(HttpClient.authPatchWithBody).mockResolvedValue({});

      await AdminEmployeesApi.updateAdminEmployee(3, {
        name: "Ana",
        email: "ana@test.com",
        cpf: "12345678901",
        status: "INACTIVE",
        unitId: 2,
      });

      expect(HttpClient.authPatchWithBody).toHaveBeenCalledWith("/employees/3", {
        name: "Ana",
        email: "ana@test.com",
        cpf: "12345678901",
        status: "INACTIVE",
        unitId: 2,
      });
    });
  });
});
