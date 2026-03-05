import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/design-system/ui/button";

type DsButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

type DsButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

interface DsButtonProps {
  variant?: DsButtonVariant;
  size?: DsButtonSize;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  asChild?: boolean;
}

function DsButton({
  variant = "default",
  size = "default",
  className,
  disabled,
  children,
  onClick,
  type = "button",
  asChild = false,
}: DsButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      disabled={disabled}
      onClick={onClick}
      type={type}
      asChild={asChild}
    >
      {children}
    </Button>
  );
}

export { DsButton, type DsButtonProps, type DsButtonVariant, type DsButtonSize };
