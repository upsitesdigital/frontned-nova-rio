import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    authGet: vi.fn(),
    post: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { AuthApi } from "./auth-api";

describe("auth-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerClient", () => {
    it("should call httpPost with /auth/client/register and payload", async () => {
      const payload = { name: "João", email: "joao@test.com", password: "Abc123!" };
      const response = { message: "Registered" };
      vi.mocked(HttpClient.post).mockResolvedValue(response);

      const result = await AuthApi.registerClient(payload);

      expect(HttpClient.post).toHaveBeenCalledWith("/auth/client/register", payload);
      expect(result).toEqual(response);
    });

    it("should include optional phone when provided", async () => {
      const payload = {
        name: "Ana",
        email: "ana@test.com",
        phone: "21999999999",
        password: "Abc123!",
      };
      vi.mocked(HttpClient.post).mockResolvedValue({ message: "Registered" });

      await AuthApi.registerClient(payload);

      expect(HttpClient.post).toHaveBeenCalledWith("/auth/client/register", payload);
    });
  });

  describe("login", () => {
    it("should call httpPost with /auth/login and credentials", async () => {
      const credentials = { email: "user@test.com", password: "secret" };
      const response = { accessToken: "at", refreshToken: "rt", userType: "client" as const };
      vi.mocked(HttpClient.post).mockResolvedValue(response);

      const result = await AuthApi.login(credentials);

      expect(HttpClient.post).toHaveBeenCalledWith("/auth/login", credentials);
      expect(result).toEqual(response);
    });
  });

  describe("requestPasswordReset", () => {
    it("should call httpPost with /auth/forgot-password", async () => {
      const payload = { email: "user@test.com" };
      const response = { message: "Email sent" };
      vi.mocked(HttpClient.post).mockResolvedValue(response);

      const result = await AuthApi.requestPasswordReset(payload);

      expect(HttpClient.post).toHaveBeenCalledWith("/auth/forgot-password", payload);
      expect(result).toEqual(response);
    });
  });

  describe("resetPassword", () => {
    it("should call httpPost with /auth/reset-password and payload", async () => {
      const payload = { email: "user@test.com", code: "123456", newPassword: "NewPass1!" };
      const response = { message: "Password reset" };
      vi.mocked(HttpClient.post).mockResolvedValue(response);

      const result = await AuthApi.resetPassword(payload);

      expect(HttpClient.post).toHaveBeenCalledWith("/auth/reset-password", payload);
      expect(result).toEqual(response);
    });
  });
});
