"use client";

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
  return (
    <DsScrollArea className={cn("h-[280px] w-[131px]", className)}>
      <div className="flex flex-col gap-[5px]">
        {slots.map((slot) => {
          const isDisabled = disabledSlots.includes(slot);
          return (
            <button
              key={slot}
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
