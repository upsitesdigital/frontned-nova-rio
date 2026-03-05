import * as React from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/design-system/ui/scroll-area";

interface DsScrollAreaProps {
  className?: string;
  children?: React.ReactNode;
  orientation?: "vertical" | "horizontal";
}

function DsScrollArea({ className, children, orientation = "vertical" }: DsScrollAreaProps) {
  return (
    <ScrollArea className={cn(className)} data-orientation={orientation}>
      {children}
    </ScrollArea>
  );
}

export { DsScrollArea, type DsScrollAreaProps };
