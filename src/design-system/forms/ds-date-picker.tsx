"use client";

import { CalendarBlankIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/design-system/ui/popover";
import { Calendar } from "@/design-system/ui/calendar";
import { Button } from "@/design-system/ui/button";
import { DsIcon } from "@/design-system/media";

interface DsDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function DsDatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
}: DsDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <DsIcon icon={CalendarBlankIcon} size="sm" />
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} disabled={disabled} />
      </PopoverContent>
    </Popover>
  );
}

export { DsDatePicker, type DsDatePickerProps };
