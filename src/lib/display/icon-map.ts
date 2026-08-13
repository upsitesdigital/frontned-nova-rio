import type { DsIconComponent } from "@/design-system";
import {
  BroomIcon,
  HouseLineIcon,
  SketchLogoIcon,
  StarFourIcon,
} from "@phosphor-icons/react/dist/ssr";

class IconMap {
  static readonly serviceIconMap: Record<string, DsIconComponent> = {
    broom: BroomIcon,
    "sketch-logo": SketchLogoIcon,
    "star-four": StarFourIcon,
    "house-line": HouseLineIcon,
  };

  static getServiceIcon(iconKey: string | null): DsIconComponent {
    if (!iconKey) return BroomIcon;
    return IconMap.serviceIconMap[iconKey] ?? BroomIcon;
  }
}

export { IconMap };
