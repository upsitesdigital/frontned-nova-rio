import { vi, describe, it, expect } from "vitest";

vi.mock("@phosphor-icons/react/dist/ssr", () => ({
  BroomIcon: "BroomIcon",
  SketchLogoIcon: "SketchLogoIcon",
  StarFourIcon: "StarFourIcon",
  HouseLineIcon: "HouseLineIcon",
}));

vi.mock("@/design-system", () => ({}));

const { SERVICE_ICON_MAP, getServiceIcon } = await import("./icon-map");

describe("SERVICE_ICON_MAP", () => {
  it("should have the broom key", () => {
    expect(SERVICE_ICON_MAP).toHaveProperty("broom");
  });

  it("should have the sketch-logo key", () => {
    expect(SERVICE_ICON_MAP).toHaveProperty("sketch-logo");
  });

  it("should have the star-four key", () => {
    expect(SERVICE_ICON_MAP).toHaveProperty("star-four");
  });

  it("should have the house-line key", () => {
    expect(SERVICE_ICON_MAP).toHaveProperty("house-line");
  });

  it("should contain exactly four entries", () => {
    expect(Object.keys(SERVICE_ICON_MAP)).toHaveLength(4);
  });

  it("should map each key to a valid icon component", () => {
    expect(SERVICE_ICON_MAP["broom"]).toBe("BroomIcon");
    expect(SERVICE_ICON_MAP["sketch-logo"]).toBe("SketchLogoIcon");
    expect(SERVICE_ICON_MAP["star-four"]).toBe("StarFourIcon");
    expect(SERVICE_ICON_MAP["house-line"]).toBe("HouseLineIcon");
  });
});

describe("getServiceIcon", () => {
  it("should return BroomIcon when iconKey is null", () => {
    const result = getServiceIcon(null);

    expect(result).toBe("BroomIcon");
  });

  it("should return BroomIcon when iconKey is an empty string", () => {
    const result = getServiceIcon("");

    expect(result).toBe("BroomIcon");
  });

  it("should return the mapped icon for a valid key", () => {
    expect(getServiceIcon("broom")).toBe("BroomIcon");
    expect(getServiceIcon("sketch-logo")).toBe("SketchLogoIcon");
    expect(getServiceIcon("star-four")).toBe("StarFourIcon");
    expect(getServiceIcon("house-line")).toBe("HouseLineIcon");
  });

  it("should return BroomIcon as fallback for an unknown key", () => {
    const result = getServiceIcon("unknown-icon");

    expect(result).toBe("BroomIcon");
  });
});
