import type { DsIconComponent } from "@/design-system";
import {
  BroomIcon,
  HouseLineIcon,
  SketchLogoIcon,
  StarFourIcon,
} from "@phosphor-icons/react/dist/ssr";

const SERVICE_ICON_MAP: Record<string, DsIconComponent> = {
  broom: BroomIcon,
  "sketch-logo": SketchLogoIcon,
  "star-four": StarFourIcon,
  "house-line": HouseLineIcon,
};

function getServiceIcon(iconKey: string | null): DsIconComponent {
  if (!iconKey) return BroomIcon;
  return SERVICE_ICON_MAP[iconKey] ?? BroomIcon;
}

export { getServiceIcon, SERVICE_ICON_MAP };
