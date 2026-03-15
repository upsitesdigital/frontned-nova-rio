import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const useSidebarStore = create<SidebarState>()((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
}));

export { useSidebarStore, type SidebarState };
