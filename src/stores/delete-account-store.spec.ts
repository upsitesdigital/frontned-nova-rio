import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/profile-api", () => ({
  deleteClientAccount: vi.fn(),
}));

vi.mock("@/api/http-client", () => ({
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

vi.mock("@/lib/auth-helpers", () => ({
  resolveErrorMessage: vi.fn((_error: unknown, fallback: string) => fallback),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    profile: {
      deleteError: "Erro ao excluir conta.",
    },
  },
}));

vi.mock("@/stores/auth-store", () => {
  const reset = vi.fn();
  return {
    useAuthStore: { getState: () => ({ reset }) },
  };
});

const { deleteClientAccount } = await import("@/api/profile-api");
const { useAuthStore } = await import("@/stores/auth-store");

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
      vi.mocked(deleteClientAccount).mockResolvedValue(undefined as never);
      useDeleteAccountStore.setState({ deletePhrase: "DELETAR" });

      const result = await useDeleteAccountStore.getState().submitDeleteAccount();

      expect(result).toBe(true);
      expect(deleteClientAccount).toHaveBeenCalledWith("DELETAR");
      expect(useAuthStore.getState().reset).toHaveBeenCalled();
      const state = useDeleteAccountStore.getState();
      expect(state.deleteDialogOpen).toBe(false);
      expect(state.deletePhrase).toBe("");
      expect(state.isSaving).toBe(false);
    });

    it("should set error and return false on failure", async () => {
      vi.mocked(deleteClientAccount).mockRejectedValue(new Error("Failed"));
      useDeleteAccountStore.setState({ deletePhrase: "DELETAR" });

      const result = await useDeleteAccountStore.getState().submitDeleteAccount();

      expect(result).toBe(false);
      expect(useDeleteAccountStore.getState().error).toBe("Erro ao excluir conta.");
      expect(useDeleteAccountStore.getState().isSaving).toBe(false);
    });

    it("should set isSaving to true during API call", async () => {
      let resolvePromise!: (value: unknown) => void;
      vi.mocked(deleteClientAccount).mockReturnValue(
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
