import { describe, it, expect, beforeEach } from "vitest";

import { useToastStore } from "./toast-store";

describe("ToastStore", () => {
  beforeEach(() => {
    useToastStore.getState().reset();
  });

  describe("initial state", () => {
    it("should start with an empty toasts array", () => {
      expect(useToastStore.getState().toasts).toEqual([]);
    });
  });

  describe("showToast", () => {
    it("should add a toast with default success variant", () => {
      useToastStore.getState().showToast("Operation complete");

      const { toasts } = useToastStore.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].title).toBe("Operation complete");
      expect(toasts[0].variant).toBe("success");
    });

    it("should add a toast with a custom variant", () => {
      useToastStore.getState().showToast("Something failed", "error");

      const { toasts } = useToastStore.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].variant).toBe("error");
    });

    it("should accumulate multiple toasts", () => {
      useToastStore.getState().showToast("First");
      useToastStore.getState().showToast("Second");

      expect(useToastStore.getState().toasts).toHaveLength(2);
    });

    it("should assign unique incrementing ids", () => {
      useToastStore.getState().showToast("A");
      useToastStore.getState().showToast("B");

      const [first, second] = useToastStore.getState().toasts;
      expect(second.id).toBeGreaterThan(first.id);
    });
  });

  describe("removeToast", () => {
    it("should remove a toast by id", () => {
      useToastStore.getState().showToast("Keep");
      useToastStore.getState().showToast("Remove");

      const toRemove = useToastStore.getState().toasts[1];
      useToastStore.getState().removeToast(toRemove.id);

      const remaining = useToastStore.getState().toasts;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].title).toBe("Keep");
    });

    it("should do nothing when id does not exist", () => {
      useToastStore.getState().showToast("Only");
      useToastStore.getState().removeToast(999);

      expect(useToastStore.getState().toasts).toHaveLength(1);
    });
  });

  describe("reset", () => {
    it("should clear all toasts", () => {
      useToastStore.getState().showToast("A");
      useToastStore.getState().showToast("B");

      useToastStore.getState().reset();

      expect(useToastStore.getState().toasts).toEqual([]);
    });
  });
});
