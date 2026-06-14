import { create } from "zustand";

interface LandingTestimonialsState {
  current: number;
  setCurrent: (index: number) => void;
  prev: (total: number) => void;
  next: (total: number) => void;
}

const useLandingTestimonialsStore = create<LandingTestimonialsState>()((set) => ({
  current: 0,
  setCurrent: (index) => set({ current: index }),
  prev: (total) => set((state) => ({ current: state.current === 0 ? total - 1 : state.current - 1 })),
  next: (total) => set((state) => ({ current: state.current === total - 1 ? 0 : state.current + 1 })),
}));

export { useLandingTestimonialsStore, type LandingTestimonialsState };
