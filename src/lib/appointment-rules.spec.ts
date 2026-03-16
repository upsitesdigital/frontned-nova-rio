import { describe, it, expect } from "vitest";
import { isCancelBlocked, CANCELLATION_WINDOW_MS } from "./appointment-rules";

describe("appointment-rules", () => {
  describe("CANCELLATION_WINDOW_MS", () => {
    it("should equal 1 hour in milliseconds", () => {
      expect(CANCELLATION_WINDOW_MS).toBe(3_600_000);
    });
  });

  describe("isCancelBlocked", () => {
    const fixedNow = new Date("2026-03-16T12:00:00Z").getTime();

    it("should return true when dateTime is null", () => {
      expect(isCancelBlocked(null, fixedNow)).toBe(true);
    });

    it("should return true when appointment is less than 1 hour away", () => {
      const inThirtyMin = new Date("2026-03-16T12:30:00Z").toISOString();
      expect(isCancelBlocked(inThirtyMin, fixedNow)).toBe(true);
    });

    it("should return false when appointment is exactly 1 hour away", () => {
      const inOneHour = new Date("2026-03-16T13:00:00Z").toISOString();
      expect(isCancelBlocked(inOneHour, fixedNow)).toBe(false);
    });

    it("should return false when appointment is more than 1 hour away", () => {
      const inTwoHours = new Date("2026-03-16T14:00:00Z").toISOString();
      expect(isCancelBlocked(inTwoHours, fixedNow)).toBe(false);
    });

    it("should return true when appointment is in the past", () => {
      const past = new Date("2026-03-16T10:00:00Z").toISOString();
      expect(isCancelBlocked(past, fixedNow)).toBe(true);
    });

    it("should return false when appointment is 1 hour and 1 ms away", () => {
      const justOver = new Date(fixedNow + CANCELLATION_WINDOW_MS + 1).toISOString();
      expect(isCancelBlocked(justOver, fixedNow)).toBe(false);
    });

    it("should use Date.now() as default when now is not provided", () => {
      const farFuture = new Date("2099-12-31T23:59:59Z").toISOString();
      expect(isCancelBlocked(farFuture)).toBe(false);
    });
  });
});
