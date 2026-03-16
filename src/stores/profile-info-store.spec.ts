import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/api/profile-api", () => ({
  fetchClientProfile: vi.fn(),
  updateClientProfile: vi.fn(),
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
    auth: { sessionExpired: "Sessao expirada." },
    profile: {
      loadError: "Erro ao carregar o perfil.",
      saveError: "Erro ao salvar o perfil.",
      updated: "Perfil atualizado!",
    },
  },
}));

vi.mock("@/stores/toast-store", () => {
  const showToast = vi.fn();
  return {
    useToastStore: { getState: () => ({ showToast }) },
  };
});

const { fetchClientProfile, updateClientProfile } = await import("@/api/profile-api");
const { useToastStore } = await import("@/stores/toast-store");

import { useProfileInfoStore } from "./profile-info-store";

const mockProfile = {
  id: 1,
  name: "John Doe",
  email: "john@test.com",
  phone: "11999999999",
  company: "ACME",
  cpfCnpj: "12345678900",
  address: "Rua Test, 123",
};

describe("ProfileInfoStore", () => {
  beforeEach(() => {
    useProfileInfoStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct defaults", () => {
      const state = useProfileInfoStore.getState();

      expect(state.profile).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isEditing).toBe(false);
      expect(state.editName).toBe("");
      expect(state.editPhone).toBe("");
      expect(state.editCompany).toBe("");
      expect(state.editCpfCnpj).toBe("");
      expect(state.editAddress).toBe("");
    });
  });

  describe("loadProfile", () => {
    it("should load profile on success", async () => {
      vi.mocked(fetchClientProfile).mockResolvedValue(mockProfile as never);

      await useProfileInfoStore.getState().loadProfile();

      const state = useProfileInfoStore.getState();
      expect(state.profile).toEqual(mockProfile);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should set error on failure", async () => {
      vi.mocked(fetchClientProfile).mockRejectedValue(new Error("Network"));

      await useProfileInfoStore.getState().loadProfile();

      const state = useProfileInfoStore.getState();
      expect(state.profile).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Erro ao carregar o perfil.");
    });

    it("should set isLoading to true during API call", async () => {
      let resolvePromise!: (value: unknown) => void;
      vi.mocked(fetchClientProfile).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        }) as never,
      );

      const promise = useProfileInfoStore.getState().loadProfile();
      expect(useProfileInfoStore.getState().isLoading).toBe(true);

      resolvePromise(mockProfile);
      await promise;

      expect(useProfileInfoStore.getState().isLoading).toBe(false);
    });
  });

  describe("startEditing", () => {
    it("should populate edit fields from profile", () => {
      useProfileInfoStore.setState({ profile: mockProfile as never });

      useProfileInfoStore.getState().startEditing();

      const state = useProfileInfoStore.getState();
      expect(state.isEditing).toBe(true);
      expect(state.editName).toBe("John Doe");
      expect(state.editPhone).toBe("11999999999");
      expect(state.editCompany).toBe("ACME");
      expect(state.editCpfCnpj).toBe("12345678900");
      expect(state.editAddress).toBe("Rua Test, 123");
      expect(state.error).toBeNull();
    });

    it("should not start editing when profile is null", () => {
      useProfileInfoStore.getState().startEditing();

      expect(useProfileInfoStore.getState().isEditing).toBe(false);
    });

    it("should default optional fields to empty string", () => {
      useProfileInfoStore.setState({
        profile: { id: 1, name: "Test", email: "t@t.com" } as never,
      });

      useProfileInfoStore.getState().startEditing();

      const state = useProfileInfoStore.getState();
      expect(state.editPhone).toBe("");
      expect(state.editCompany).toBe("");
      expect(state.editCpfCnpj).toBe("");
      expect(state.editAddress).toBe("");
    });
  });

  describe("cancelEditing", () => {
    it("should set isEditing to false and clear error", () => {
      useProfileInfoStore.setState({ isEditing: true, error: "some error" });

      useProfileInfoStore.getState().cancelEditing();

      const state = useProfileInfoStore.getState();
      expect(state.isEditing).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("setEdit fields", () => {
    it("should update editName", () => {
      useProfileInfoStore.getState().setEditName("New Name");
      expect(useProfileInfoStore.getState().editName).toBe("New Name");
    });

    it("should update editPhone", () => {
      useProfileInfoStore.getState().setEditPhone("11888888888");
      expect(useProfileInfoStore.getState().editPhone).toBe("11888888888");
    });

    it("should update editCompany", () => {
      useProfileInfoStore.getState().setEditCompany("NewCo");
      expect(useProfileInfoStore.getState().editCompany).toBe("NewCo");
    });

    it("should update editCpfCnpj", () => {
      useProfileInfoStore.getState().setEditCpfCnpj("99988877766");
      expect(useProfileInfoStore.getState().editCpfCnpj).toBe("99988877766");
    });

    it("should update editAddress", () => {
      useProfileInfoStore.getState().setEditAddress("Rua Nova, 456");
      expect(useProfileInfoStore.getState().editAddress).toBe("Rua Nova, 456");
    });
  });

  describe("setProfile", () => {
    it("should update profile directly", () => {
      useProfileInfoStore.getState().setProfile(mockProfile as never);
      expect(useProfileInfoStore.getState().profile).toEqual(mockProfile);
    });
  });

  describe("saveProfile", () => {
    it("should save profile and show toast on success", async () => {
      useProfileInfoStore.setState({
        editName: "Updated",
        editPhone: "11777777777",
        editCompany: "NewCo",
        editCpfCnpj: "11111111111",
        editAddress: "New Address",
      });
      const updatedProfile = { ...mockProfile, name: "Updated" };
      vi.mocked(updateClientProfile).mockResolvedValue(updatedProfile as never);

      const result = await useProfileInfoStore.getState().saveProfile();

      expect(result).toBe(true);
      const state = useProfileInfoStore.getState();
      expect(state.profile).toEqual(updatedProfile);
      expect(state.isSaving).toBe(false);
      expect(state.isEditing).toBe(false);
      expect(useToastStore.getState().showToast).toHaveBeenCalledWith("Perfil atualizado!");
    });

    it("should set error and return false on failure", async () => {
      vi.mocked(updateClientProfile).mockRejectedValue(new Error("Save failed"));

      const result = await useProfileInfoStore.getState().saveProfile();

      expect(result).toBe(false);
      const state = useProfileInfoStore.getState();
      expect(state.isSaving).toBe(false);
      expect(state.error).toBe("Erro ao salvar o perfil.");
    });

    it("should pass edit fields to API", async () => {
      useProfileInfoStore.setState({
        editName: "Test",
        editPhone: "123",
        editCompany: "Co",
        editCpfCnpj: "456",
        editAddress: "Addr",
      });
      vi.mocked(updateClientProfile).mockResolvedValue(mockProfile as never);

      await useProfileInfoStore.getState().saveProfile();

      expect(updateClientProfile).toHaveBeenCalledWith({
        name: "Test",
        phone: "123",
        company: "Co",
        cpfCnpj: "456",
        address: "Addr",
      });
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useProfileInfoStore.setState({
        profile: mockProfile as never,
        isLoading: true,
        isSaving: true,
        error: "error",
        isEditing: true,
        editName: "Name",
        editPhone: "Phone",
        editCompany: "Company",
        editCpfCnpj: "CpfCnpj",
        editAddress: "Address",
      });

      useProfileInfoStore.getState().reset();

      const state = useProfileInfoStore.getState();
      expect(state.profile).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isSaving).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isEditing).toBe(false);
      expect(state.editName).toBe("");
    });
  });
});
