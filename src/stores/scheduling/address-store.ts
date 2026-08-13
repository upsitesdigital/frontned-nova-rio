import { create } from "zustand";

import type { Address } from "@/types/scheduling";
import { ValidateAddress } from "@/use-cases/scheduling/validate-address";

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
let addressLoadSeq = 0;

const initialState: AddressState = {
  cep: "",
  address: null,
  isLoadingAddress: false,
  cepError: null,
};

const useAddressStore = create<AddressStore>()((set, get) => ({
  ...initialState,

  setCep: (cep) => set({ cep }),

  loadAddressByCep: async (cep) => {
    const seq = ++addressLoadSeq;
    set({ isLoadingAddress: true, cepError: null });
    try {
      const result = await ValidateAddress.validateAddress(cep);
      if (seq !== addressLoadSeq || (get().cep !== "" && get().cep !== cep)) return;
      set({
        address: result.address,
        isLoadingAddress: false,
        cepError: result.error,
      });
    } catch {
      if (seq !== addressLoadSeq || (get().cep !== "" && get().cep !== cep)) return;
      set({ address: null, isLoadingAddress: false, cepError: "CEP não encontrado" });
    }
  },

  clearAddress: () => {
    addressLoadSeq++;
    set({ address: null, cepError: null });
  },

  reset: () => {
    addressLoadSeq++;
    set(initialState);
  },
}));

export { useAddressStore, type AddressStore };
