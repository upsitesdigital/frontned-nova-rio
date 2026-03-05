import { create } from "zustand";

import type { Address } from "@/types/scheduling";
import { validateAddress } from "@/use-cases/validate-address";

interface AddressState {
  cep: string;
  address: Address | null;
  isLoadingAddress: boolean;
  cepError: string | null;
}

interface AddressActions {
  setCep: (cep: string) => void;
  loadAddressByCep: (cep: string) => Promise<void>;
  clearAddress: () => void;
  reset: () => void;
}

type AddressStore = AddressState & AddressActions;

const initialState: AddressState = {
  cep: "",
  address: null,
  isLoadingAddress: false,
  cepError: null,
};

const useAddressStore = create<AddressStore>()((set) => ({
  ...initialState,

  setCep: (cep) => set({ cep }),

  loadAddressByCep: async (cep) => {
    set({ isLoadingAddress: true, cepError: null });
    try {
      const result = await validateAddress(cep);
      set({
        address: result.address,
        isLoadingAddress: false,
        cepError: result.error,
      });
    } catch (error) {
      console.error("Failed to validate address:", error);
      set({ address: null, isLoadingAddress: false, cepError: "CEP não encontrado" });
    }
  },

  clearAddress: () => set({ address: null, cepError: null }),

  reset: () => set(initialState),
}));

export { useAddressStore, type AddressStore };
