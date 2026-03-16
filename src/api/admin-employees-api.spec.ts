import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
  httpAuthPatchWithBody: vi.fn(),
}));

const { httpAuthGet, httpAuthPatchWithBody } = await import("./http-client");

import { fetchAdminEmployees, fetchAdminEmployeeById, updateAdminEmployee } from "./admin-employees-api";

describe("admin-employees-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAdminEmployees", () => {
    it("should call with page and limit params", async () => {
      const response = { data: [], total: 0, page: 1, limit: 20 };
      vi.mocked(httpAuthGet).mockResolvedValue(response);

      await fetchAdminEmployees({ page: 1, limit: 20 });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("/employees?");
      expect(url).toContain("page=1");
      expect(url).toContain("limit=20");
    });

    it("should include status param when provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await fetchAdminEmployees({ page: 1, limit: 20, status: "ACTIVE" });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("status=ACTIVE");
    });

    it("should include search param when provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await fetchAdminEmployees({ page: 1, limit: 20, search: "Carlos" });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).toContain("search=Carlos");
    });

    it("should not include optional params when not provided", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      await fetchAdminEmployees({ page: 1, limit: 20 });

      const url = vi.mocked(httpAuthGet).mock.calls[0][0] as string;
      expect(url).not.toContain("status=");
      expect(url).not.toContain("search=");
    });

    it("should forward AbortSignal", async () => {
      vi.mocked(httpAuthGet).mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });
      const controller = new AbortController();

      await fetchAdminEmployees({ page: 1, limit: 20 }, controller.signal);

      expect(httpAuthGet).toHaveBeenCalledWith(expect.any(String), controller.signal);
    });
  });

  describe("fetchAdminEmployeeById", () => {
    it("should call GET /employees/:id", async () => {
      const employee = { id: 5, name: "Carlos", email: "carlos@test.com" };
      vi.mocked(httpAuthGet).mockResolvedValue(employee);

      const result = await fetchAdminEmployeeById(5);

      expect(httpAuthGet).toHaveBeenCalledWith("/employees/5");
      expect(result).toEqual(employee);
    });
  });

  describe("updateAdminEmployee", () => {
    it("should call PATCH /employees/:id with data", async () => {
      const updated = { id: 5, name: "Carlos Magno", email: "carlos@test.com" };
      vi.mocked(httpAuthPatchWithBody).mockResolvedValue(updated);

      const result = await updateAdminEmployee(5, { name: "Carlos Magno" });

      expect(httpAuthPatchWithBody).toHaveBeenCalledWith("/employees/5", { name: "Carlos Magno" });
      expect(result).toEqual(updated);
    });

    it("should send all provided fields", async () => {
      vi.mocked(httpAuthPatchWithBody).mockResolvedValue({});

      await updateAdminEmployee(3, {
        name: "Ana",
        email: "ana@test.com",
        cpf: "12345678901",
        status: "INACTIVE",
        unitId: 2,
      });

      expect(httpAuthPatchWithBody).toHaveBeenCalledWith("/employees/3", {
        name: "Ana",
        email: "ana@test.com",
        cpf: "12345678901",
        status: "INACTIVE",
        unitId: 2,
      });
    });
  });
});
