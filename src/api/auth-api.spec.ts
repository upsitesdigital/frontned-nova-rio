import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
  httpPost: vi.fn(),
}));

const { httpPost } = await import("./http-client");

import {
  registerClient,
  login,
  refreshTokens,
  requestPasswordReset,
  resetPassword,
} from "./auth-api";

describe("auth-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerClient", () => {
    it("should call httpPost with /auth/client/register and payload", async () => {
      const payload = { name: "João", email: "joao@test.com", password: "Abc123!" };
      const response = { message: "Registered" };
      vi.mocked(httpPost).mockResolvedValue(response);

      const result = await registerClient(payload);

      expect(httpPost).toHaveBeenCalledWith("/auth/client/register", payload);
      expect(result).toEqual(response);
    });

    it("should include optional phone when provided", async () => {
      const payload = { name: "Ana", email: "ana@test.com", phone: "21999999999", password: "Abc123!" };
      vi.mocked(httpPost).mockResolvedValue({ message: "Registered" });

      await registerClient(payload);

      expect(httpPost).toHaveBeenCalledWith("/auth/client/register", payload);
    });
  });

  describe("login", () => {
    it("should call httpPost with /auth/login and credentials", async () => {
      const credentials = { email: "user@test.com", password: "secret" };
      const response = { accessToken: "at", refreshToken: "rt", userType: "client" as const };
      vi.mocked(httpPost).mockResolvedValue(response);

      const result = await login(credentials);

      expect(httpPost).toHaveBeenCalledWith("/auth/login", credentials);
      expect(result).toEqual(response);
    });
  });

  describe("requestPasswordReset", () => {
    it("should call httpPost with /auth/forgot-password", async () => {
      const payload = { email: "user@test.com" };
      const response = { message: "Email sent" };
      vi.mocked(httpPost).mockResolvedValue(response);

      const result = await requestPasswordReset(payload);

      expect(httpPost).toHaveBeenCalledWith("/auth/forgot-password", payload);
      expect(result).toEqual(response);
    });
  });

  describe("resetPassword", () => {
    it("should call httpPost with /auth/reset-password and payload", async () => {
      const payload = { email: "user@test.com", code: "123456", newPassword: "NewPass1!" };
      const response = { message: "Password reset" };
      vi.mocked(httpPost).mockResolvedValue(response);

      const result = await resetPassword(payload);

      expect(httpPost).toHaveBeenCalledWith("/auth/reset-password", payload);
      expect(result).toEqual(response);
    });
  });

  describe("refreshTokens", () => {
    it("should call httpPost with /auth/refresh and refreshToken", async () => {
      const tokens = { accessToken: "new-at", refreshToken: "new-rt" };
      vi.mocked(httpPost).mockResolvedValue(tokens);

      const result = await refreshTokens("old-rt");

      expect(httpPost).toHaveBeenCalledWith("/auth/refresh", { refreshToken: "old-rt" });
      expect(result).toEqual(tokens);
    });
  });
});
