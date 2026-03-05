import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Badge, badgeVariants } from "@/design-system/ui/badge";

type DsBadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

interface DsBadgeProps {
  variant?: DsBadgeVariant;
  className?: string;
  children?: React.ReactNode;
}

function DsBadge({ variant = "default", className, children }: DsBadgeProps) {
  return (
    <Badge variant={variant} className={cn(className)}>
      {children}
    </Badge>
  );
}

export { DsBadge, type DsBadgeProps, type DsBadgeVariant };
