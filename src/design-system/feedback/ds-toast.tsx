"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { useToastStore, type Toast } from "@/stores/toast-store";
import { DsAlert } from "./ds-alert";

const DISPLAY_DURATION = 5000;
const ANIMATION_DURATION = 400;

function DsToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const dismissingRef = useRef(false);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissingRef.current = true;
      elRef.current?.classList.remove("animate-[slideInRight_0.4s_ease-out_forwards]");
      elRef.current?.classList.add("animate-[slideOutRight_0.4s_ease-in_forwards]");

      setTimeout(() => removeToast(toast.id), ANIMATION_DURATION);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div
      ref={elRef}
      className="animate-[slideInRight_0.4s_ease-out_forwards]"
    >
      <DsAlert variant={toast.variant} title={toast.title} />
    </div>
  );
}

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

export { DsToastContainer, DsToastItem };
