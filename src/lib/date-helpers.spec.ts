import { describe, it, expect } from "vitest";
import { formatShortDate, formatDateToISO, buildTodayDate, buildWeekRange } from "./date-helpers";

describe("formatShortDate", () => {
  it("should format valid ISO date as dd/MM", () => {
    expect(formatShortDate("2026-03-15")).toBe("15/03");
  });

  it("should format date with time component", () => {
    expect(formatShortDate("2026-12-01T10:30:00.000Z")).toBe("01/12");
  });

  it("should return --/-- for invalid date string", () => {
    expect(formatShortDate("not-a-date")).toBe("--/--");
  });

  it("should return --/-- for empty string", () => {
    expect(formatShortDate("")).toBe("--/--");
  });
});

describe("formatDateToISO", () => {
  it("should format Date as yyyy-MM-dd", () => {
    expect(formatDateToISO(new Date(2026, 2, 15))).toBe("2026-03-15");
  });

  it("should pad single-digit month and day", () => {
    expect(formatDateToISO(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("should handle December correctly", () => {
    expect(formatDateToISO(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});

describe("buildTodayDate", () => {
  it("should return a string matching yyyy-MM-dd format", () => {
    const result = buildTodayDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("buildWeekRange", () => {
  it("should return weekStart and weekEnd in yyyy-MM-dd format", () => {
    const result = buildWeekRange();
    expect(result.weekStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.weekEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should have weekEnd after weekStart", () => {
    const result = buildWeekRange();
    expect(result.weekEnd > result.weekStart).toBe(true);
  });
});
