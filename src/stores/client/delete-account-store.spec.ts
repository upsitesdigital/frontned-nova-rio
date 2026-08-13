import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/client/profile-api", () => ({
  ProfileApi: { deleteClientAccount: vi.fn() },
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

vi.mock("@/lib/auth/auth-helpers", () => ({
  AuthHelpers: {
    resolveErrorMessage: vi.fn((_error: unknown, fallback: string) => fallback),
  },
}));

vi.mock("@/lib/core/messages", () => ({
  Messages: {
    profile: {
      deleteError: "Erro ao excluir conta.",
    },
  },
}));

vi.mock("@/stores/auth/auth-store", () => {
  const reset = vi.fn();
  return {
    useAuthStore: { getState: () => ({ reset }) },
  };
});

const { ProfileApi } = await import("@/api/client/profile-api");
const { useAuthStore } = await import("@/stores/auth/auth-store");

import { useDeleteAccountStore } from "./delete-account-store";

describe("DeleteAccountStore", () => {
  beforeEach(() => {
    useDeleteAccountStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useDeleteAccountStore.getState();

      expect(state.deleteDialogOpen).toBe(false);
      expect(state.deletePhrase).toBe("");
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("openDeleteDialog", () => {
    it("should open dialog and clear error", () => {
      useDeleteAccountStore.setState({ error: "old error" });

      useDeleteAccountStore.getState().openDeleteDialog();

      const state = useDeleteAccountStore.getState();
      expect(state.deleteDialogOpen).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe("closeDeleteDialog", () => {
    it("should close dialog and reset phrase and error", () => {
      useDeleteAccountStore.setState({
        deleteDialogOpen: true,
        deletePhrase: "DELETAR",
        error: "error",
      });

      useDeleteAccountStore.getState().closeDeleteDialog();

      const state = useDeleteAccountStore.getState();
      expect(state.deleteDialogOpen).toBe(false);
      expect(state.deletePhrase).toBe("");
      expect(state.error).toBeNull();
    });
  });

  describe("setDeletePhrase", () => {
    it("should update deletePhrase", () => {
      useDeleteAccountStore.getState().setDeletePhrase("DELETAR");
      expect(useDeleteAccountStore.getState().deletePhrase).toBe("DELETAR");
    });
  });

  describe("submitDeleteAccount", () => {
    it("should delete account, reset auth store, and return true on success", async () => {
      vi.mocked(ProfileApi.deleteClientAccount).mockResolvedValue(undefined as never);
      useDeleteAccountStore.setState({ deletePhrase: "DELETAR" });

      const result = await useDeleteAccountStore.getState().submitDeleteAccount();

      expect(result).toBe(true);
      expect(ProfileApi.deleteClientAccount).toHaveBeenCalledWith("DELETAR");
      expect(useAuthStore.getState().reset).toHaveBeenCalled();
      const state = useDeleteAccountStore.getState();
      expect(state.deleteDialogOpen).toBe(false);
      expect(state.deletePhrase).toBe("");
      expect(state.isSaving).toBe(false);
    });

    it("should set error and return false on failure", async () => {
      vi.mocked(ProfileApi.deleteClientAccount).mockRejectedValue(new Error("Failed"));
      useDeleteAccountStore.setState({ deletePhrase: "DELETAR" });

      const result = await useDeleteAccountStore.getState().submitDeleteAccount();

      expect(result).toBe(false);
      expect(useDeleteAccountStore.getState().error).toBe("Erro ao excluir conta.");
      expect(useDeleteAccountStore.getState().isSaving).toBe(false);
    });

    it("should set isSaving to true during API call", async () => {
      let resolvePromise!: (value: unknown) => void;
      vi.mocked(ProfileApi.deleteClientAccount).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }) as never,
      );
      useDeleteAccountStore.setState({ deletePhrase: "DELETAR" });

      const promise = useDeleteAccountStore.getState().submitDeleteAccount();
      expect(useDeleteAccountStore.getState().isSaving).toBe(true);

      resolvePromise(undefined);
      await promise;
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useDeleteAccountStore.setState({
        deleteDialogOpen: true,
        deletePhrase: "DELETAR",
        isSaving: true,
        error: "error",
      });

      useDeleteAccountStore.getState().reset();

      const state = useDeleteAccountStore.getState();
      expect(state.deleteDialogOpen).toBe(false);
      expect(state.deletePhrase).toBe("");
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
