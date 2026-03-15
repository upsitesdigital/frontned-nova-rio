"use client";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/design-system/ui";

type DsSheetSide = "left" | "right" | "top" | "bottom";

interface DsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DsSheetSide;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function DsSheet({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  className,
}: DsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={cn(className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export { DsSheet, type DsSheetProps, type DsSheetSide };
