import type { Icon, IconProps } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type DsIconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<DsIconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const sizeClassMap: Record<DsIconSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
};

type DsIconComponent = Icon;

interface DsIconProps {
  icon: DsIconComponent;
  size?: DsIconSize;
  weight?: IconProps["weight"];
  className?: string;
}

function DsIcon({ icon: IconComponent, size = "md", weight = "regular", className }: DsIconProps) {
  return (
    <IconComponent
      size={sizeMap[size]}
      weight={weight}
      className={cn("shrink-0", sizeClassMap[size], className)}
    />
  );
}

export { DsIcon, type DsIconProps, type DsIconSize, type DsIconComponent };
