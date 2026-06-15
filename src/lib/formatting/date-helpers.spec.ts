import { describe, it, expect } from "vitest";
import { DateHelpers } from "./date-helpers";

describe("DateHelpers.formatShortDate", () => {
  it("should format valid ISO date as dd/MM", () => {
    expect(DateHelpers.formatShortDate("2026-03-15")).toBe("15/03");
  });

  it("should format date with time component", () => {
    expect(DateHelpers.formatShortDate("2026-12-01T10:30:00.000Z")).toBe("01/12");
  });

  it("should return --/-- for invalid date string", () => {
    expect(DateHelpers.formatShortDate("not-a-date")).toBe("--/--");
  });

  it("should return --/-- for empty string", () => {
    expect(DateHelpers.formatShortDate("")).toBe("--/--");
  });
});

describe("DateHelpers.formatDateToISO", () => {
  it("should format Date as yyyy-MM-dd", () => {
    expect(DateHelpers.formatDateToISO(new Date(2026, 2, 15))).toBe("2026-03-15");
  });

  it("should pad single-digit month and day", () => {
    expect(DateHelpers.formatDateToISO(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("should handle December correctly", () => {
    expect(DateHelpers.formatDateToISO(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});

describe("DateHelpers.buildTodayDate", () => {
  it("should return a string matching yyyy-MM-dd format", () => {
    const result = DateHelpers.buildTodayDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("DateHelpers.buildWeekRange", () => {
  it("should return weekStart and weekEnd in yyyy-MM-dd format", () => {
    const result = DateHelpers.buildWeekRange();
    expect(result.weekStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.weekEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should have weekEnd after weekStart", () => {
    const result = DateHelpers.buildWeekRange();
    expect(result.weekEnd > result.weekStart).toBe(true);
  });
});
