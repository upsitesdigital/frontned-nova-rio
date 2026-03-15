"use client";

import { useEffect, useRef } from "react";

import { useToastStore, type Toast } from "@/stores/toast-store";
import { DsAlert } from "./ds-alert";

const DISPLAY_DURATION = 5000;
const ANIMATION_DURATION = 400;

function DsToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      elRef.current?.classList.remove("animate-[slideInRight_0.4s_ease-out_forwards]");
      elRef.current?.classList.add("animate-[slideOutRight_0.4s_ease-in_forwards]");

      setTimeout(() => removeToast(toast.id), ANIMATION_DURATION);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div ref={elRef} className="animate-[slideInRight_0.4s_ease-out_forwards]">
      <DsAlert variant={toast.variant} title={toast.title} />
    </div>
  );
}

export { DsToastItem };
