import { vi, describe, it, expect } from "vitest";

vi.mock("@/lib/core/messages", () => ({
  Messages: { auth: { sessionExpired: "Session expired" } },
}));

const { HttpClientError } = await import("@/lib/auth/http-error");
const { AuthHelpers } = await import("./auth-helpers");

describe("isAuthError", () => {
  it("should return true for 401", () => {
    expect(AuthHelpers.isAuthError(new HttpClientError(401, "Unauthorized"))).toBe(true);
  });

  it("should return true for 403", () => {
    expect(AuthHelpers.isAuthError(new HttpClientError(403, "Forbidden"))).toBe(true);
  });

  it("should return false for 400", () => {
    expect(AuthHelpers.isAuthError(new HttpClientError(400, "Bad request"))).toBe(false);
  });

  it("should return false for 500", () => {
    expect(AuthHelpers.isAuthError(new HttpClientError(500, "Server error"))).toBe(false);
  });

  it("should return false for generic Error", () => {
    expect(AuthHelpers.isAuthError(new Error("Network error"))).toBe(false);
  });

  it("should return false for non-Error", () => {
    expect(AuthHelpers.isAuthError("string error")).toBe(false);
    expect(AuthHelpers.isAuthError(null)).toBe(false);
    expect(AuthHelpers.isAuthError(undefined)).toBe(false);
  });
});

describe("resolveErrorMessage", () => {
  it("should return session expired for 401", () => {
    expect(
      AuthHelpers.resolveErrorMessage(new HttpClientError(401, "Unauthorized"), "fallback"),
    ).toBe("Session expired");
  });

  it("should return fallback for 500+", () => {
    expect(
      AuthHelpers.resolveErrorMessage(new HttpClientError(500, "Server error"), "fallback"),
    ).toBe("fallback");
    expect(
      AuthHelpers.resolveErrorMessage(new HttpClientError(502, "Bad gateway"), "fallback"),
    ).toBe("fallback");
  });

  it("should return error message for 4xx (non-401)", () => {
    expect(
      AuthHelpers.resolveErrorMessage(new HttpClientError(400, "Bad request"), "fallback"),
    ).toBe("Bad request");
    expect(
      AuthHelpers.resolveErrorMessage(new HttpClientError(422, "Validation failed"), "fallback"),
    ).toBe("Validation failed");
  });

  it("should return fallback for generic Error", () => {
    expect(AuthHelpers.resolveErrorMessage(new Error("Network error"), "fallback")).toBe(
      "fallback",
    );
  });

  it("should return fallback for non-Error", () => {
    expect(AuthHelpers.resolveErrorMessage("string", "fallback")).toBe("fallback");
    expect(AuthHelpers.resolveErrorMessage(null, "fallback")).toBe("fallback");
  });
});
