"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { DsScrollArea } from "@/design-system/primitives";

interface DsTimeSlotPickerProps {
  slots: string[];
  value?: string;
  onChange?: (slot: string) => void;
  disabledSlots?: string[];
  className?: string;
}

function DsTimeSlotPicker({
  slots,
  value,
  onChange,
  disabledSlots = [],
  className,
}: DsTimeSlotPickerProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "center" });
  }, [value]);

  const setRef = useCallback(
    (slot: string) => (el: HTMLButtonElement | null) => {
      if (slot === value) {
        (selectedRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
      }
    },
    [value],
  );

  return (
    <DsScrollArea className={cn("h-70 w-32.75", className)}>
      <div className="flex flex-col gap-1.25">
        {slots.map((slot) => {
          const isDisabled = disabledSlots.includes(slot);
          return (
            <button
              key={slot}
              ref={setRef(slot)}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange?.(slot)}
              className={cn(
                "flex h-8 shrink-0 items-center justify-center rounded-lg px-3 text-[15px] leading-[1.4] transition-colors",
                isDisabled ? "cursor-not-allowed opacity-30" : "cursor-pointer",
                value === slot && !isDisabled
                  ? "border border-primary bg-accent text-foreground"
                  : "bg-nova-gray-50 text-foreground hover:bg-nova-gray-100",
              )}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </DsScrollArea>
  );
}

export { DsTimeSlotPicker, type DsTimeSlotPickerProps };
