"use client";

import { cn } from "@/lib/utils";

interface DsEmptyStateProps {
  message: string;
  className?: string;
}

function DsEmptyState({ message, className }: DsEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[10px] bg-nova-gray-50 px-6 py-12",
        className,
      )}
    >
      <p className="text-sm text-nova-gray-400">{message}</p>
    </div>
  );
}

export { DsEmptyState, type DsEmptyStateProps };
