import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/design-system/ui/separator";

interface DsSeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function DsSeparator({ orientation = "horizontal", className }: DsSeparatorProps) {
  return <Separator orientation={orientation} className={cn(className)} />;
}

export { DsSeparator, type DsSeparatorProps };
