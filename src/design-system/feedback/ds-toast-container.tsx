"use client";

import { cn } from "@/lib/utils";
import { useToastStore } from "@/stores/toast-store";
import { DsToastItem } from "./ds-toast-item";

function DsToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className={cn("fixed right-6 top-6 z-50 flex w-96 flex-col gap-3")}>
      {toasts.map((toast) => (
        <DsToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export { DsToastContainer };
