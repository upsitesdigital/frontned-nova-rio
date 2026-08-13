import { create } from "zustand";

interface LandingFaqState {
  openIndex: number | null;
  toggle: (index: number) => void;
}

const useLandingFaqStore = create<LandingFaqState>()((set) => ({
  openIndex: null,
  toggle: (index) => set((state) => ({ openIndex: state.openIndex === index ? null : index })),
}));

export { useLandingFaqStore, type LandingFaqState };
