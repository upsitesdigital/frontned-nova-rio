import { describe, it, expect, beforeEach } from "vitest";

import { usePasswordVisibilityStore } from "./password-visibility-store";

describe("PasswordVisibilityStore", () => {
  beforeEach(() => {
    usePasswordVisibilityStore.getState().resetAll();
  });

  describe("initial state", () => {
    it("should start with empty visibleFields", () => {
      expect(usePasswordVisibilityStore.getState().visibleFields).toEqual({});
    });
  });

  describe("isVisible", () => {
    it("should return false for an unknown field", () => {
      expect(usePasswordVisibilityStore.getState().isVisible("password")).toBe(false);
    });

    it("should return true for a field set to visible", () => {
      usePasswordVisibilityStore.getState().setVisibility("password", true);

      expect(usePasswordVisibilityStore.getState().isVisible("password")).toBe(true);
    });
  });

  describe("toggleVisibility", () => {
    it("should toggle an unset field to true", () => {
      usePasswordVisibilityStore.getState().toggleVisibility("password");

      expect(usePasswordVisibilityStore.getState().isVisible("password")).toBe(true);
    });

    it("should toggle a true field to false", () => {
      usePasswordVisibilityStore.getState().setVisibility("password", true);

      usePasswordVisibilityStore.getState().toggleVisibility("password");

      expect(usePasswordVisibilityStore.getState().isVisible("password")).toBe(false);
    });

    it("should not affect other fields", () => {
      usePasswordVisibilityStore.getState().setVisibility("fieldA", true);

      usePasswordVisibilityStore.getState().toggleVisibility("fieldB");

      expect(usePasswordVisibilityStore.getState().isVisible("fieldA")).toBe(true);
      expect(usePasswordVisibilityStore.getState().isVisible("fieldB")).toBe(true);
    });
  });

  describe("setVisibility", () => {
    it("should set a field to visible", () => {
      usePasswordVisibilityStore.getState().setVisibility("confirm", true);

      expect(usePasswordVisibilityStore.getState().visibleFields["confirm"]).toBe(true);
    });

    it("should set a field to hidden", () => {
      usePasswordVisibilityStore.getState().setVisibility("confirm", true);
      usePasswordVisibilityStore.getState().setVisibility("confirm", false);

      expect(usePasswordVisibilityStore.getState().isVisible("confirm")).toBe(false);
    });
  });

  describe("resetAll", () => {
    it("should clear all visibility state", () => {
      usePasswordVisibilityStore.getState().setVisibility("a", true);
      usePasswordVisibilityStore.getState().setVisibility("b", true);

      usePasswordVisibilityStore.getState().resetAll();

      expect(usePasswordVisibilityStore.getState().visibleFields).toEqual({});
    });
  });
});
