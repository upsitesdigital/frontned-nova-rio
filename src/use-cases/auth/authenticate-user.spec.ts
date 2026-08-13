import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/auth-api", () => ({
  AuthApi: { login: vi.fn() },
}));

vi.mock("@/api/core/http-client", () => ({
  HttpClientError: class HttpClientError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message);
      this.name = "HttpClientError";
    }
  },
}));

vi.mock("@/lib/core/messages", () => ({
  Messages: {
    auth: { loginError: "Login error" },
  },
}));

const api = await import("@/api/core/auth-api");
const { HttpClientError } = await import("@/api/core/http-client");
const { AuthenticateUser } = await import("./authenticate-user");

describe("authenticateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should return success with tokens and userType on valid login", async () => {
      vi.mocked(api.AuthApi.login).mockResolvedValue({
        accessToken: "access-123",
        refreshToken: "refresh-456",
        userType: "client",
      });

      const result = await AuthenticateUser.authenticateUser("user@test.com", "password123");

      expect(result).toEqual({
        type: "success",
        accessToken: "access-123",
        refreshToken: "refresh-456",
        userType: "client",
      });
    });

    it("should pass email and password to login API", async () => {
      vi.mocked(api.AuthApi.login).mockResolvedValue({
        accessToken: "t",
        refreshToken: "r",
        userType: "admin",
      });

      await AuthenticateUser.authenticateUser("admin@test.com", "secret");

      expect(api.AuthApi.login).toHaveBeenCalledWith({
        email: "admin@test.com",
        password: "secret",
      });
    });
  });

  describe("error handling", () => {
    it("should return pending when status is 403", async () => {
      vi.mocked(api.AuthApi.login).mockRejectedValue(new HttpClientError(403, "Forbidden"));

      const result = await AuthenticateUser.authenticateUser("user@test.com", "pass");

      expect(result).toEqual({ type: "pending" });
    });

    it("should return invalidCredentials when status is 401", async () => {
      vi.mocked(api.AuthApi.login).mockRejectedValue(new HttpClientError(401, "Unauthorized"));

      const result = await AuthenticateUser.authenticateUser("user@test.com", "wrong");

      expect(result).toEqual({ type: "invalidCredentials" });
    });

    it("should return error with message for other HttpClientError statuses", async () => {
      vi.mocked(api.AuthApi.login).mockRejectedValue(new HttpClientError(500, "Server down"));

      const result = await AuthenticateUser.authenticateUser("user@test.com", "pass");

      expect(result).toEqual({ type: "error", message: "Server down" });
    });

    it("should return error with generic message for non-HttpClientError", async () => {
      vi.mocked(api.AuthApi.login).mockRejectedValue(new TypeError("Network failed"));

      const result = await AuthenticateUser.authenticateUser("user@test.com", "pass");

      expect(result).toEqual({ type: "error", message: "Login error" });
    });
  });
});
