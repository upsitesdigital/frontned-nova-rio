import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/design-system/ui/label";

interface DsLabelProps {
  className?: string;
  htmlFor?: string;
  children?: React.ReactNode;
}

function DsLabel({ className, htmlFor, children }: DsLabelProps) {
  return (
    <Label className={cn(className)} htmlFor={htmlFor}>
      {children}
    </Label>
  );
}

export { DsLabel, type DsLabelProps };
