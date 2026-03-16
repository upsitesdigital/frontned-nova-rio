"use client";

import { cn } from "@/lib/utils";

interface DsLoadingStateProps {
  message?: string;
  className?: string;
}

function DsLoadingState({
  message = "Carregando...",
  className,
}: DsLoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[10px] bg-nova-gray-50 py-16",
        className,
      )}
      role="status"
    >
      <p className="text-base text-nova-gray-400">{message}</p>
    </div>
  );
}

export { DsLoadingState, type DsLoadingStateProps };
