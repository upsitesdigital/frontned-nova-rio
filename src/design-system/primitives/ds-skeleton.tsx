import * as React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/design-system/ui/skeleton";

interface DsSkeletonProps {
  className?: string;
}

function DsSkeleton({ className }: DsSkeletonProps) {
  return <Skeleton className={cn(className)} />;
}

export { DsSkeleton, type DsSkeletonProps };
