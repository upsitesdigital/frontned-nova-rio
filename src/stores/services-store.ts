import { create } from "zustand";

import { fetchServices } from "@/api/services-api";
import type { Service } from "@/types/service";

interface ServicesState {
  services: Service[];
  isLoadingServices: boolean;
  selectedServiceId: number | null;
  error: string | null;
}

interface ServicesActions {
  loadServices: () => Promise<void>;
  setSelectedServiceId: (id: number) => void;
  reset: () => void;
}

type ServicesStore = ServicesState & ServicesActions;

const initialState: ServicesState = {
  services: [],
  isLoadingServices: false,
  selectedServiceId: null,
  error: null,
};

const useServicesStore = create<ServicesStore>()((set) => ({
  ...initialState,

  loadServices: async () => {
    set({ isLoadingServices: true, error: null });
    try {
      const services = await fetchServices();
      set({ services, isLoadingServices: false });
    } catch {
      set({ isLoadingServices: false, error: "Erro ao carregar serviços." });
    }
  },

  setSelectedServiceId: (id) => set({ selectedServiceId: id }),

  reset: () => set(initialState),
}));

export { useServicesStore, type ServicesStore };
