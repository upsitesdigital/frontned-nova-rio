import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/admin-appointments-api", () => ({
  fetchClients: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { adminAppointments: { clientsError: "Clients error" } },
}));

const api = await import("@/api/admin-appointments-api");
const { getApprovedClientOptions } = await import("./get-approved-client-options");

describe("getApprovedClientOptions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return only approved clients", async () => {
    vi.mocked(api.fetchClients).mockResolvedValue([
      { id: 1, name: "Maria", status: "APPROVED" },
      { id: 2, name: "Pending", status: "PENDING" },
      { id: 3, name: "João", status: "APPROVED" },
    ]);

    const result = await getApprovedClientOptions();

    expect(result.data).toEqual([
      { id: 1, name: "Maria" },
      { id: 3, name: "João" },
    ]);
    expect(result.error).toBeNull();
  });

  it("should return empty array when none approved", async () => {
    vi.mocked(api.fetchClients).mockResolvedValue([
      { id: 1, name: "Pending", status: "PENDING" },
    ]);

    const result = await getApprovedClientOptions();

    expect(result.data).toEqual([]);
  });

  it("should return error on API failure", async () => {
    vi.mocked(api.fetchClients).mockRejectedValue(new Error("fail"));

    const result = await getApprovedClientOptions();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Clients error");
  });
});
