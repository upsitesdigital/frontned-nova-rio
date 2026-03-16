import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";
import { appConfig } from "@/config/app";

const AUTH_COOKIE = appConfig.authCookieName;

function createRequest(path: string, options?: { cookie?: string }): NextRequest {
  const url = `http://localhost:3000${path}`;
  const headers = new Headers();
  if (options?.cookie) headers.set("cookie", options.cookie);
  return new NextRequest(url, { headers });
}

function buildCookie(userType: string): string {
  const cookieValue = JSON.stringify({ state: { userType } });
  return `${AUTH_COOKIE}=${encodeURIComponent(cookieValue)}`;
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
    it("should redirect to /login when no cookie", () => {
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

  describe("admin routes with admin cookie", () => {
    it("should pass through with admin userType in cookie", () => {
      const response = middleware(createRequest("/admin", { cookie: buildCookie("admin") }));
      expect(response.headers.get("x-middleware-next")).toBe("1");
    });
  });

  describe("admin routes with client cookie", () => {
    it("should redirect to /dashboard when client tries to access admin", () => {
      const response = middleware(createRequest("/admin", { cookie: buildCookie("client") }));
      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/dashboard");
    });
  });

  describe("malformed cookie", () => {
    it("should redirect to /login with invalid cookie JSON", () => {
      const response = middleware(
        createRequest("/admin", { cookie: `${AUTH_COOKIE}=not-valid-json` }),
      );
      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
    });
  });
});
