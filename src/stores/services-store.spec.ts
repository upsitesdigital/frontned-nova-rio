import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Service } from "@/types/service";

vi.mock("@/api/services-api", () => ({
  fetchPublicServices: vi.fn(),
}));

vi.mock("@/lib/messages", () => ({
  MESSAGES: {
    services: {
      loadError: "Erro ao carregar servicos.",
    },
  },
}));

const { fetchPublicServices } = await import("@/api/services-api");
const { useServicesStore } = await import("./services-store");

describe("ServicesStore", () => {
  beforeEach(() => {
    useServicesStore.getState().reset();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have empty services and default flags", () => {
      const state = useServicesStore.getState();

      expect(state.services).toEqual([]);
      expect(state.isLoadingServices).toBe(false);
      expect(state.selectedServiceId).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe("loadServices", () => {
    it("should load services on success", async () => {
      const services = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Limpeza",
          description: null,
          icon: null,
          basePrice: 100,
          allowSingle: true,
          allowPackage: false,
          allowRecurrence: false,
          isActive: true,
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: 2,
          uuid: "uuid-2",
          name: "Cuidador",
          description: null,
          icon: null,
          basePrice: 200,
          allowSingle: true,
          allowPackage: false,
          allowRecurrence: false,
          isActive: true,
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      ];
      vi.mocked(fetchPublicServices).mockResolvedValue(services);

      await useServicesStore.getState().loadServices();

      const state = useServicesStore.getState();
      expect(state.services).toEqual(services);
      expect(state.isLoadingServices).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should set error on failure", async () => {
      vi.mocked(fetchPublicServices).mockRejectedValue(new Error("Network"));

      await useServicesStore.getState().loadServices();

      const state = useServicesStore.getState();
      expect(state.services).toEqual([]);
      expect(state.isLoadingServices).toBe(false);
      expect(state.error).toBe("Erro ao carregar servicos.");
    });

    it("should set isLoadingServices during API call", async () => {
      let resolveLoad!: (value: Service[]) => void;
      vi.mocked(fetchPublicServices).mockReturnValue(
        new Promise((resolve) => {
          resolveLoad = resolve;
        }),
      );

      const loadPromise = useServicesStore.getState().loadServices();

      expect(useServicesStore.getState().isLoadingServices).toBe(true);

      resolveLoad([]);
      await loadPromise;

      expect(useServicesStore.getState().isLoadingServices).toBe(false);
    });

    it("should clear previous error on new load", async () => {
      useServicesStore.setState({ error: "old error" });
      vi.mocked(fetchPublicServices).mockResolvedValue([]);

      await useServicesStore.getState().loadServices();

      expect(useServicesStore.getState().error).toBeNull();
    });
  });

  describe("setSelectedServiceId", () => {
    it("should update selectedServiceId", () => {
      useServicesStore.getState().setSelectedServiceId(5);

      expect(useServicesStore.getState().selectedServiceId).toBe(5);
    });
  });

  describe("reset", () => {
    it("should restore initial state", () => {
      useServicesStore.setState({
        services: [{ id: 1, name: "X" }] as never[],
        isLoadingServices: true,
        selectedServiceId: 3,
        error: "some error",
      });

      useServicesStore.getState().reset();

      const state = useServicesStore.getState();
      expect(state.services).toEqual([]);
      expect(state.isLoadingServices).toBe(false);
      expect(state.selectedServiceId).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});
