import { describe, it, expect } from "vitest";
import { Constants } from "./constants";

describe("Constants.flowInputClass", () => {
  it("should be a non-empty string", () => {
    expect(typeof Constants.flowInputClass).toBe("string");
    expect(Constants.flowInputClass.length).toBeGreaterThan(0);
  });

  it("should contain rounded border styling", () => {
    expect(Constants.flowInputClass).toContain("rounded-[6px]");
  });

  it("should contain the border color class", () => {
    expect(Constants.flowInputClass).toContain("border-nova-gray-500");
  });

  it("should contain horizontal padding", () => {
    expect(Constants.flowInputClass).toContain("px-4");
  });

  it("should contain vertical padding", () => {
    expect(Constants.flowInputClass).toContain("py-3");
  });

  it("should disable shadow", () => {
    expect(Constants.flowInputClass).toContain("shadow-none");
  });

  it("should set auto height for default size data attribute", () => {
    expect(Constants.flowInputClass).toContain("data-[size=default]:h-auto");
  });
});
