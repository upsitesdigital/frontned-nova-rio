"use client";

import { cn } from "@/lib/utils";
import { DsToastItem } from "./ds-toast-item";
import type { DsAlertVariant } from "./ds-alert";

interface DsToast {
  id: number;
  variant: DsAlertVariant;
  title: string;
}

interface DsToastContainerProps {
  toasts: DsToast[];
  onRemove: (id: number) => void;
}

function DsToastContainer({ toasts, onRemove }: DsToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={cn("fixed right-6 top-6 z-50 flex w-96 flex-col gap-3")}>
      {toasts.map((toast) => (
        <DsToastItem
          key={toast.id}
          id={toast.id}
          variant={toast.variant}
          title={toast.title}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export { DsToastContainer, type DsToastContainerProps, type DsToast };
