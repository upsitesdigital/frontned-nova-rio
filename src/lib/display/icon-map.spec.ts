import { vi, describe, it, expect } from "vitest";

vi.mock("@phosphor-icons/react/dist/ssr", () => ({
  BroomIcon: "BroomIcon",
  SketchLogoIcon: "SketchLogoIcon",
  StarFourIcon: "StarFourIcon",
  HouseLineIcon: "HouseLineIcon",
}));

vi.mock("@/design-system", () => ({}));

const { IconMap } = await import("./icon-map");

describe("IconMap.serviceIconMap", () => {
  it("should have the broom key", () => {
    expect(IconMap.serviceIconMap).toHaveProperty("broom");
  });

  it("should have the sketch-logo key", () => {
    expect(IconMap.serviceIconMap).toHaveProperty("sketch-logo");
  });

  it("should have the star-four key", () => {
    expect(IconMap.serviceIconMap).toHaveProperty("star-four");
  });

  it("should have the house-line key", () => {
    expect(IconMap.serviceIconMap).toHaveProperty("house-line");
  });

  it("should contain exactly four entries", () => {
    expect(Object.keys(IconMap.serviceIconMap)).toHaveLength(4);
  });

  it("should map each key to a valid icon component", () => {
    expect(IconMap.serviceIconMap["broom"]).toBe("BroomIcon");
    expect(IconMap.serviceIconMap["sketch-logo"]).toBe("SketchLogoIcon");
    expect(IconMap.serviceIconMap["star-four"]).toBe("StarFourIcon");
    expect(IconMap.serviceIconMap["house-line"]).toBe("HouseLineIcon");
  });
});

describe("IconMap.getServiceIcon", () => {
  it("should return BroomIcon when iconKey is null", () => {
    const result = IconMap.getServiceIcon(null);

    expect(result).toBe("BroomIcon");
  });

  it("should return BroomIcon when iconKey is an empty string", () => {
    const result = IconMap.getServiceIcon("");

    expect(result).toBe("BroomIcon");
  });

  it("should return the mapped icon for a valid key", () => {
    expect(IconMap.getServiceIcon("broom")).toBe("BroomIcon");
    expect(IconMap.getServiceIcon("sketch-logo")).toBe("SketchLogoIcon");
    expect(IconMap.getServiceIcon("star-four")).toBe("StarFourIcon");
    expect(IconMap.getServiceIcon("house-line")).toBe("HouseLineIcon");
  });

  it("should return BroomIcon as fallback for an unknown key", () => {
    const result = IconMap.getServiceIcon("unknown-icon");

    expect(result).toBe("BroomIcon");
  });
});
