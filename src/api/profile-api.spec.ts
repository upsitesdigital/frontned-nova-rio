import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("./http-client", () => ({
  httpAuthGet: vi.fn(),
  httpAuthPost: vi.fn(),
  httpAuthPatchWithBody: vi.fn(),
}));

const { httpAuthGet, httpAuthPost, httpAuthPatchWithBody } = await import("./http-client");

import {
  fetchClientProfile,
  updateClientProfile,
  requestEmailChange,
  verifyEmailChange,
  requestPasswordChange,
  verifyPasswordChange,
  deleteClientAccount,
} from "./profile-api";

describe("profile-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchClientProfile", () => {
    it("should call httpAuthGet with /clients/profile", async () => {
      const profile = { id: 1, name: "Maria", email: "maria@test.com" };
      vi.mocked(httpAuthGet).mockResolvedValue(profile);

      const result = await fetchClientProfile();

      expect(httpAuthGet).toHaveBeenCalledWith("/clients/profile");
      expect(result).toEqual(profile);
    });
  });

  describe("updateClientProfile", () => {
    it("should call httpAuthPatchWithBody with /clients/profile and data", async () => {
      const data = { name: "Maria Silva", phone: "21999999999" };
      const updated = { id: 1, name: "Maria Silva", phone: "21999999999" };
      vi.mocked(httpAuthPatchWithBody).mockResolvedValue(updated);

      const result = await updateClientProfile(data);

      expect(httpAuthPatchWithBody).toHaveBeenCalledWith("/clients/profile", data);
      expect(result).toEqual(updated);
    });

    it("should send partial data when only one field is updated", async () => {
      const data = { company: "Nova Rio" };
      vi.mocked(httpAuthPatchWithBody).mockResolvedValue({ id: 1, company: "Nova Rio" });

      await updateClientProfile(data);

      expect(httpAuthPatchWithBody).toHaveBeenCalledWith("/clients/profile", { company: "Nova Rio" });
    });
  });

  describe("requestEmailChange", () => {
    it("should call httpAuthPost with correct endpoint and newEmail", async () => {
      vi.mocked(httpAuthPost).mockResolvedValue(undefined);

      await requestEmailChange("new@test.com");

      expect(httpAuthPost).toHaveBeenCalledWith("/clients/profile/email/request-change", {
        newEmail: "new@test.com",
      });
    });
  });

  describe("verifyEmailChange", () => {
    it("should call httpAuthPost with code and newEmail", async () => {
      vi.mocked(httpAuthPost).mockResolvedValue(undefined);

      await verifyEmailChange("123456", "new@test.com");

      expect(httpAuthPost).toHaveBeenCalledWith("/clients/profile/email/verify-change", {
        code: "123456",
        newEmail: "new@test.com",
      });
    });
  });

  describe("requestPasswordChange", () => {
    it("should call httpAuthPost with empty body", async () => {
      vi.mocked(httpAuthPost).mockResolvedValue(undefined);

      await requestPasswordChange();

      expect(httpAuthPost).toHaveBeenCalledWith("/clients/profile/password/request-change", {});
    });
  });

  describe("verifyPasswordChange", () => {
    it("should call httpAuthPost with code and newPassword", async () => {
      vi.mocked(httpAuthPost).mockResolvedValue(undefined);

      await verifyPasswordChange("654321", "NewPass1!");

      expect(httpAuthPost).toHaveBeenCalledWith("/clients/profile/password/verify-change", {
        code: "654321",
        newPassword: "NewPass1!",
      });
    });
  });

  describe("deleteClientAccount", () => {
    it("should call httpAuthPost with confirmPhrase", async () => {
      vi.mocked(httpAuthPost).mockResolvedValue(undefined);

      await deleteClientAccount("DELETAR CONTA");

      expect(httpAuthPost).toHaveBeenCalledWith("/clients/profile/delete-account", {
        confirmPhrase: "DELETAR CONTA",
      });
    });
  });
});
