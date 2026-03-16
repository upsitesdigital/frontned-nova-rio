import { describe, it, expect } from "vitest";
import { decodeJwtPayload } from "./jwt-helpers";

function buildJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fakesig`;
}

describe("decodeJwtPayload", () => {
  it("should decode admin JWT payload", () => {
    const token = buildJwt({ sub: 1, type: "admin" });
    const result = decodeJwtPayload(token);
    expect(result?.type).toBe("admin");
  });

  it("should decode client JWT payload", () => {
    const token = buildJwt({ sub: 2, type: "client" });
    const result = decodeJwtPayload(token);
    expect(result?.type).toBe("client");
  });

  it("should return null for invalid JWT (not 3 parts)", () => {
    expect(decodeJwtPayload("not-a-jwt")).toBeNull();
    expect(decodeJwtPayload("only.two")).toBeNull();
  });

  it("should return null for malformed base64", () => {
    expect(decodeJwtPayload("a.!!!invalid!!!.c")).toBeNull();
  });

  it("should return payload without type field", () => {
    const token = buildJwt({ sub: 1, email: "test@test.com" });
    const result = decodeJwtPayload(token);
    expect(result).toBeDefined();
    expect(result?.type).toBeUndefined();
  });

  it("should handle URL-safe base64 characters", () => {
    const header = btoa(JSON.stringify({ alg: "HS256" }));
    const payload = btoa(JSON.stringify({ type: "admin" }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    const token = `${header}.${payload}.sig`;
    const result = decodeJwtPayload(token);
    expect(result?.type).toBe("admin");
  });

  it("should handle base64 payload without padding", () => {
    const header = btoa(JSON.stringify({ alg: "HS256" }));
    const payload = btoa(JSON.stringify({ type: "admin" })).replace(/=+$/, "");
    const token = `${header}.${payload}.sig`;
    const result = decodeJwtPayload(token);
    expect(result?.type).toBe("admin");
  });
});
