import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

function buildAdminJwt(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: 1, email: "admin@test.com", type: "admin" }));
  const signature = "fakesig";
  return `${header}.${payload}.${signature}`;
}

function buildClientJwt(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: 2, email: "client@test.com", type: "client" }));
  const signature = "fakesig";
  return `${header}.${payload}.${signature}`;
}

function createRequest(path: string, options?: { authorization?: string; cookie?: string }): NextRequest {
  const url = `http://localhost:3000${path}`;
  const headers = new Headers();
  if (options?.authorization) headers.set("authorization", options.authorization);
  if (options?.cookie) headers.set("cookie", options.cookie);
  return new NextRequest(url, { headers });
}

describe("middleware", () => {
  describe("non-admin routes", () => {
    it("should pass through for /login", () => {
      const response = middleware(createRequest("/login"));
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });

    it("should pass through for /dashboard", () => {
      const response = middleware(createRequest("/dashboard"));
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });

    it("should pass through for root", () => {
      const response = middleware(createRequest("/"));
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });
  });

  describe("admin routes without auth", () => {
    it("should redirect to /login when no token", () => {
      const response = middleware(createRequest("/admin"));
      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
    });

    it("should redirect to /login for nested admin routes", () => {
      const response = middleware(createRequest("/admin/clientes"));
      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
    });
  });

  describe("admin routes with admin JWT", () => {
    it("should pass through when Authorization header has admin JWT", () => {
      const response = middleware(
        createRequest("/admin", { authorization: `Bearer ${buildAdminJwt()}` }),
      );
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });
  });

  describe("admin routes with client JWT", () => {
    it("should redirect to /dashboard when client tries to access admin", () => {
      const response = middleware(
        createRequest("/admin", { authorization: `Bearer ${buildClientJwt()}` }),
      );
      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/dashboard");
    });
  });

  describe("admin routes with cookie auth", () => {
    it("should pass through with admin token in cookie", () => {
      const token = buildAdminJwt();
      const cookieValue = JSON.stringify({ state: { userType: "admin", accessToken: token } });
      const response = middleware(
        createRequest("/admin", { cookie: `nova-rio-auth=${encodeURIComponent(cookieValue)}` }),
      );
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });

    it("should redirect client token in cookie to /dashboard", () => {
      const token = buildClientJwt();
      const cookieValue = JSON.stringify({ state: { userType: "client", accessToken: token } });
      const response = middleware(
        createRequest("/admin", { cookie: `nova-rio-auth=${encodeURIComponent(cookieValue)}` }),
      );
      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/dashboard");
    });
  });

  describe("malformed tokens", () => {
    it("should pass through with malformed JWT (cannot determine type)", () => {
      const response = middleware(
        createRequest("/admin", { authorization: "Bearer not-a-jwt" }),
      );
      // Cannot determine type, so it passes through (backend will reject)
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });
  });
});
