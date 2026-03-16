import { create } from "zustand";

import type { Service } from "@/types/service";
import { loadPublicServices } from "@/use-cases/load-public-services";

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
    const result = await loadPublicServices();
    if (result.data) {
      set({ services: result.data, isLoadingServices: false });
    } else {
      set({ isLoadingServices: false, error: result.error });
    }
  },

  setSelectedServiceId: (id) => set({ selectedServiceId: id }),

  reset: () => set(initialState),
}));

export { useServicesStore, type ServicesStore };
