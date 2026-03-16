import { describe, it, expect, beforeEach } from "vitest";

import { useSidebarStore } from "./sidebar-store";

describe("SidebarStore", () => {
  beforeEach(() => {
    useSidebarStore.setState({ collapsed: false });
  });

  describe("initial state", () => {
    it("should start with collapsed false", () => {
      expect(useSidebarStore.getState().collapsed).toBe(false);
    });
  });

  describe("setCollapsed", () => {
    it("should set collapsed to true", () => {
      useSidebarStore.getState().setCollapsed(true);

      expect(useSidebarStore.getState().collapsed).toBe(true);
    });

    it("should set collapsed to false", () => {
      useSidebarStore.setState({ collapsed: true });

      useSidebarStore.getState().setCollapsed(false);

      expect(useSidebarStore.getState().collapsed).toBe(false);
    });
  });

  describe("toggleCollapsed", () => {
    it("should toggle from false to true", () => {
      useSidebarStore.getState().toggleCollapsed();

      expect(useSidebarStore.getState().collapsed).toBe(true);
    });

    it("should toggle from true to false", () => {
      useSidebarStore.setState({ collapsed: true });

      useSidebarStore.getState().toggleCollapsed();

      expect(useSidebarStore.getState().collapsed).toBe(false);
    });

    it("should toggle multiple times correctly", () => {
      useSidebarStore.getState().toggleCollapsed();
      useSidebarStore.getState().toggleCollapsed();

      expect(useSidebarStore.getState().collapsed).toBe(false);
    });
  });
});
