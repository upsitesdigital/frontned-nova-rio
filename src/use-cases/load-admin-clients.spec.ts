import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-clients-api", () => ({
  fetchAdminClients: vi.fn(),
}));

vi.mock("@/api/http-client", () => ({
  HttpClientError: class HttpClientError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message);
      this.name = "HttpClientError";
    }
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  isAuthError: (error: unknown) =>
    error instanceof Error &&
    "status" in error &&
    ((error as { status: number }).status === 401 || (error as { status: number }).status === 403),
  resolveErrorMessage: (_error: unknown, fallback: string) => fallback,
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminClients: { loadError: "Load error" } },
}));

const api = await import("@/api/admin-clients-api");
const { loadAdminClients } = await import("./load-admin-clients");

const mockApiClient = {
  id: 1,
  uuid: "uuid-1",
  name: "Fábio Moraes",
  email: "fabio@test.com",
  phone: null,
  avatarUrl: null,
  company: "GreenLeaf",
  cpfCnpj: "222.555.888-07",
  address: null,
  complement: null,
  status: "PENDING" as const,
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
  unit: { id: 1, name: "Le Monde" },
};

describe("loadAdminClients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return mapped clients on success", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [mockApiClient],
      total: 1,
      page: 1,
      limit: 20,
    });

    const result = await loadAdminClients({ page: 1, limit: 20 });

    expect(result.data).not.toBeNull();
    expect(result.data!.clients).toHaveLength(1);
    expect(result.data!.total).toBe(1);
    expect(result.error).toBeNull();
    expect(result.isAuthError).toBe(false);
  });

  it("should map client fields correctly", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [mockApiClient],
      total: 1,
      page: 1,
      limit: 20,
    });

    const result = await loadAdminClients({ page: 1, limit: 20 });
    const client = result.data!.clients[0];

    expect(client.id).toBe("1");
    expect(client.name).toBe("Fábio Moraes");
    expect(client.company).toBe("GreenLeaf");
    expect(client.document).toBe("222.555.888-07");
    expect(client.unit).toBe("Le Monde");
    expect(client.status).toBe("pending");
    expect(client.email).toBe("fabio@test.com");
    expect(client.registrationDate).toBe("15/01/2026");
  });

  it("should use dash for null company", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [{ ...mockApiClient, company: null }],
      total: 1,
      page: 1,
      limit: 20,
    });

    const result = await loadAdminClients({ page: 1, limit: 20 });

    expect(result.data!.clients[0].company).toBe("—");
  });

  it("should use dash for null cpfCnpj", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [{ ...mockApiClient, cpfCnpj: null }],
      total: 1,
      page: 1,
      limit: 20,
    });

    const result = await loadAdminClients({ page: 1, limit: 20 });

    expect(result.data!.clients[0].document).toBe("—");
  });

  it("should use dash for null unit", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [{ ...mockApiClient, unit: null }],
      total: 1,
      page: 1,
      limit: 20,
    });

    const result = await loadAdminClients({ page: 1, limit: 20 });

    expect(result.data!.clients[0].unit).toBe("—");
  });

  it("should map ACTIVE status to active", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [{ ...mockApiClient, status: "ACTIVE" as const }],
      total: 1,
      page: 1,
      limit: 20,
    });

    const result = await loadAdminClients({ page: 1, limit: 20 });

    expect(result.data!.clients[0].status).toBe("active");
  });

  it("should convert status filter to uppercase", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 20,
    });

    await loadAdminClients({ page: 1, limit: 20, status: "pending" });

    expect(api.fetchAdminClients).toHaveBeenCalledWith(
      expect.objectContaining({ status: "PENDING" }),
    );
  });

  it("should not pass status when filter is 'all'", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 20,
    });

    await loadAdminClients({ page: 1, limit: 20, status: "all" });

    const params = vi.mocked(api.fetchAdminClients).mock.calls[0][0];
    expect(params).not.toHaveProperty("status");
  });

  it("should pass search when provided", async () => {
    vi.mocked(api.fetchAdminClients).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 20,
    });

    await loadAdminClients({ page: 1, limit: 20, search: "Fábio" });

    expect(api.fetchAdminClients).toHaveBeenCalledWith(
      expect.objectContaining({ search: "Fábio" }),
    );
  });

  it("should return error with fallback message on failure", async () => {
    vi.mocked(api.fetchAdminClients).mockRejectedValue(new Error("Network error"));

    const result = await loadAdminClients({ page: 1, limit: 20 });

    expect(result.data).toBeNull();
    expect(result.error).toBe("Load error");
  });

  it("should detect auth error on 401", async () => {
    const authError = Object.assign(new Error("Unauthorized"), { status: 401 });
    vi.mocked(api.fetchAdminClients).mockRejectedValue(authError);

    const result = await loadAdminClients({ page: 1, limit: 20 });

    expect(result.isAuthError).toBe(true);
  });
});
