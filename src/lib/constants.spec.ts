import { describe, it, expect } from "vitest";
import { FLOW_INPUT_CLASS } from "./constants";

describe("FLOW_INPUT_CLASS", () => {
  it("should be a non-empty string", () => {
    expect(typeof FLOW_INPUT_CLASS).toBe("string");
    expect(FLOW_INPUT_CLASS.length).toBeGreaterThan(0);
  });

  it("should contain rounded border styling", () => {
    expect(FLOW_INPUT_CLASS).toContain("rounded-[6px]");
  });

  it("should contain the border color class", () => {
    expect(FLOW_INPUT_CLASS).toContain("border-nova-gray-500");
  });

  it("should contain horizontal padding", () => {
    expect(FLOW_INPUT_CLASS).toContain("px-4");
  });

  it("should contain vertical padding", () => {
    expect(FLOW_INPUT_CLASS).toContain("py-3");
  });

  it("should disable shadow", () => {
    expect(FLOW_INPUT_CLASS).toContain("shadow-none");
  });

  it("should set auto height for default size data attribute", () => {
    expect(FLOW_INPUT_CLASS).toContain("data-[size=default]:h-auto");
  });
});
