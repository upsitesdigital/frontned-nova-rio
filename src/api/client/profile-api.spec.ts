import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/core/http-client", () => ({
  HttpClient: {
    authGet: vi.fn(),
    authPost: vi.fn(),
    authPatchWithBody: vi.fn(),
  },
}));

const { HttpClient } = await import("@/api/core/http-client");

import { ProfileApi } from "./profile-api";

describe("profile-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchClientProfile", () => {
    it("should call httpAuthGet with /clients/profile", async () => {
      const profile = { id: 1, name: "Maria", email: "maria@test.com" };
      vi.mocked(HttpClient.authGet).mockResolvedValue(profile);

      const result = await ProfileApi.fetchClientProfile();

      expect(HttpClient.authGet).toHaveBeenCalledWith("/clients/profile");
      expect(result).toEqual(profile);
    });
  });

  describe("updateClientProfile", () => {
    it("should call httpAuthPatchWithBody with /clients/profile and data", async () => {
      const data = { name: "Maria Silva", phone: "21999999999" };
      const updated = { id: 1, name: "Maria Silva", phone: "21999999999" };
      vi.mocked(HttpClient.authPatchWithBody).mockResolvedValue(updated);

      const result = await ProfileApi.updateClientProfile(data);

      expect(HttpClient.authPatchWithBody).toHaveBeenCalledWith("/clients/profile", data);
      expect(result).toEqual(updated);
    });

    it("should send partial data when only one field is updated", async () => {
      const data = { company: "Nova Rio" };
      vi.mocked(HttpClient.authPatchWithBody).mockResolvedValue({ id: 1, company: "Nova Rio" });

      await ProfileApi.updateClientProfile(data);

      expect(HttpClient.authPatchWithBody).toHaveBeenCalledWith("/clients/profile", {
        company: "Nova Rio",
      });
    });
  });

  describe("requestEmailChange", () => {
    it("should call httpAuthPost with correct endpoint and newEmail", async () => {
      vi.mocked(HttpClient.authPost).mockResolvedValue(undefined);

      await ProfileApi.requestEmailChange("new@test.com");

      expect(HttpClient.authPost).toHaveBeenCalledWith("/clients/profile/email/request-change", {
        newEmail: "new@test.com",
      });
    });
  });

  describe("verifyEmailChange", () => {
    it("should call httpAuthPost with code and newEmail", async () => {
      vi.mocked(HttpClient.authPost).mockResolvedValue(undefined);

      await ProfileApi.verifyEmailChange("123456", "new@test.com");

      expect(HttpClient.authPost).toHaveBeenCalledWith("/clients/profile/email/verify-change", {
        code: "123456",
        newEmail: "new@test.com",
      });
    });
  });

  describe("requestPasswordChange", () => {
    it("should call httpAuthPost with empty body", async () => {
      vi.mocked(HttpClient.authPost).mockResolvedValue(undefined);

      await ProfileApi.requestPasswordChange();

      expect(HttpClient.authPost).toHaveBeenCalledWith("/clients/profile/password/request-change", {});
    });
  });

  describe("verifyPasswordChange", () => {
    it("should call httpAuthPost with code and newPassword", async () => {
      vi.mocked(HttpClient.authPost).mockResolvedValue(undefined);

      await ProfileApi.verifyPasswordChange("654321", "NewPass1!");

      expect(HttpClient.authPost).toHaveBeenCalledWith("/clients/profile/password/verify-change", {
        code: "654321",
        newPassword: "NewPass1!",
      });
    });
  });

  describe("deleteClientAccount", () => {
    it("should call httpAuthPost with confirmPhrase", async () => {
      vi.mocked(HttpClient.authPost).mockResolvedValue(undefined);

      await ProfileApi.deleteClientAccount("DELETAR CONTA");

      expect(HttpClient.authPost).toHaveBeenCalledWith("/clients/profile/delete-account", {
        confirmPhrase: "DELETAR CONTA",
      });
    });
  });
});
