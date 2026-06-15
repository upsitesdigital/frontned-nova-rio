import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("should return a single class unchanged", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("should merge multiple classes", () => {
    const result = cn("px-4", "py-2");

    expect(result).toBe("px-4 py-2");
  });

  it("should resolve conflicting Tailwind classes in favor of the last one", () => {
    const result = cn("text-red-500", "text-blue-500");

    expect(result).toBe("text-blue-500");
  });

  it("should handle conditional classes via clsx syntax", () => {
    const result = cn("base", false && "hidden", "visible");

    expect(result).toBe("base visible");
  });

  it("should handle undefined and null values", () => {
    const result = cn("base", undefined, null, "end");

    expect(result).toBe("base end");
  });

  it("should return an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("should handle array inputs", () => {
    const result = cn(["px-2", "py-2"]);

    expect(result).toBe("px-2 py-2");
  });

  it("should handle object inputs", () => {
    const result = cn({ "text-red-500": true, hidden: false });

    expect(result).toBe("text-red-500");
  });

  it("should merge padding conflicts correctly", () => {
    const result = cn("px-4", "px-8");

    expect(result).toBe("px-8");
  });
});
