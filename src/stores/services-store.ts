import { create } from "zustand";

import { fetchServices } from "@/api/services-api";
import type { Service } from "@/types/service";

interface ServicesState {
  services: Service[];
  isLoadingServices: boolean;
  selectedServiceId: number | null;
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
};

const useServicesStore = create<ServicesStore>()((set) => ({
  ...initialState,

  loadServices: async () => {
    set({ isLoadingServices: true });
    try {
      const services = await fetchServices();
      set({ services, isLoadingServices: false });
    } catch (error) {
      console.error("Failed to load services:", error);
      set({ isLoadingServices: false });
    }
  },

  setSelectedServiceId: (id) => set({ selectedServiceId: id }),

  reset: () => set(initialState),
}));

export { useServicesStore, type ServicesStore };
