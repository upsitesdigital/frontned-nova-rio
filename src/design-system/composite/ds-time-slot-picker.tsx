"use client";

import { cn } from "@/lib/utils";
import { DsScrollArea } from "@/design-system/primitives";

interface DsTimeSlotPickerProps {
  slots: string[];
  value?: string;
  onChange?: (slot: string) => void;
  className?: string;
}

function DsTimeSlotPicker({ slots, value, onChange, className }: DsTimeSlotPickerProps) {
  return (
    <DsScrollArea className={cn("h-[280px] w-[131px]", className)}>
      <div className="flex flex-col gap-[5px]">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onChange?.(slot)}
            className={cn(
              "flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lg px-3 text-[15px] leading-[1.4] transition-colors",
              value === slot
                ? "border border-primary bg-accent text-foreground"
                : "bg-nova-gray-50 text-foreground hover:bg-nova-gray-100",
            )}
          >
            {slot}
          </button>
        ))}
      </div>
    </DsScrollArea>
  );
}

export { DsTimeSlotPicker, type DsTimeSlotPickerProps };
