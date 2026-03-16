"use client";

import { useEffect, useRef } from "react";

import { DsAlert, type DsAlertVariant } from "./ds-alert";

const DISPLAY_DURATION = 5000;
const ANIMATION_DURATION = 400;

interface DsToastItemProps {
  id: number;
  variant: DsAlertVariant;
  title: string;
  onRemove: (id: number) => void;
}

function DsToastItem({ id, variant, title, onRemove }: DsToastItemProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      elRef.current?.classList.remove("animate-[slideInRight_0.4s_ease-out_forwards]");
      elRef.current?.classList.add("animate-[slideOutRight_0.4s_ease-in_forwards]");

      setTimeout(() => onRemove(id), ANIMATION_DURATION);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div ref={elRef} className="animate-[slideInRight_0.4s_ease-out_forwards]">
      <DsAlert variant={variant} title={title} />
    </div>
  );
}

export { DsToastItem, type DsToastItemProps };
