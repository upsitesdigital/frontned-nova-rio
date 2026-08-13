import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/scheduling-api", () => ({
  fetchTimeSlots: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: { scheduling: { loadTimeSlotsError: "Load slots error" } },
}));

const api = await import("@/api/scheduling-api");
const { loadTimeSlots } = await import("./load-time-slots");

describe("loadTimeSlots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return time slots on success", async () => {
    const slots = [
      { time: "09:00", available: true },
      { time: "10:00", available: false },
    ];
    vi.mocked(api.fetchTimeSlots).mockResolvedValue(slots);

    const result = await loadTimeSlots("2026-03-16");

    expect(result.data).toEqual(slots);
    expect(result.error).toBeNull();
  });

  it("should call fetchTimeSlots with the correct date", async () => {
    vi.mocked(api.fetchTimeSlots).mockResolvedValue([]);

    await loadTimeSlots("2026-04-01");

    expect(api.fetchTimeSlots).toHaveBeenCalledWith("2026-04-01");
  });

  it("should return error message on failure", async () => {
    vi.mocked(api.fetchTimeSlots).mockRejectedValue(new Error("Network error"));

    const result = await loadTimeSlots("2026-03-16");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Load slots error");
  });

  it("should return empty array when API returns empty list", async () => {
    vi.mocked(api.fetchTimeSlots).mockResolvedValue([]);

    const result = await loadTimeSlots("2026-03-16");

    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });
});
