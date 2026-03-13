import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/design-system/ui/button";
import { DsIcon, type DsIconSize, type DsIconComponent } from "@/design-system/media";
import type { IconProps } from "@phosphor-icons/react";

type DsIconButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

type DsIconButtonSize = "icon" | "icon-xs" | "icon-sm" | "icon-lg";

interface DsIconButtonProps {
  icon: DsIconComponent;
  iconSize?: DsIconSize;
  iconWeight?: IconProps["weight"];
  variant?: DsIconButtonVariant;
  size?: DsIconButtonSize;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel: string;
}

function DsIconButton({
  icon,
  iconSize = "md",
  iconWeight,
  variant = "default",
  size = "icon",
  className,
  disabled,
  onClick,
  ariaLabel,
}: DsIconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      disabled={disabled}
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
    >
      <DsIcon icon={icon} size={iconSize} weight={iconWeight} />
    </Button>
  );
}

export { DsIconButton, type DsIconButtonProps, type DsIconButtonVariant, type DsIconButtonSize };
