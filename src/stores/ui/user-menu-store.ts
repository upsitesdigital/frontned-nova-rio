import { create } from "zustand";

interface UserMenuState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const useUserMenuStore = create<UserMenuState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
}));

export { useUserMenuStore, type UserMenuState };
