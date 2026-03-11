import type { Matcher } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/design-system/ui/calendar";
import { DsTimeSlotPicker } from "./ds-time-slot-picker";
import { DsSeparator } from "@/design-system/primitives";
import { DsButton } from "@/design-system/primitives";

interface DsDateTimePickerProps {
  date?: Date;
  time?: string;
  onDateChange?: (date: Date | undefined) => void;
  onTimeChange?: (time: string) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  timeSlots?: string[];
  disabledSlots?: string[];
  disabledDays?: Matcher | Matcher[];
  disabledDayTooltip?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  showActions?: boolean;
  className?: string;
}

const DEFAULT_TIME_SLOTS = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

function DsDateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  onCancel,
  onConfirm,
  timeSlots = DEFAULT_TIME_SLOTS,
  disabledSlots,
  disabledDays,
  disabledDayTooltip,
  cancelLabel = "Cancelar",
  confirmLabel = "Ok",
  showActions = true,
  className,
}: DsDateTimePickerProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col overflow-hidden rounded-xl border border-nova-gray-300 bg-white",
        className,
      )}
    >
      <div className="flex">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={disabledDays}
          disabledDayTooltip={disabledDayTooltip}
          className="p-4"
        />
        <DsSeparator orientation="vertical" className="h-auto" />
        <div className="flex items-start px-3 py-4">
          <DsTimeSlotPicker
            slots={timeSlots}
            value={time}
            onChange={onTimeChange}
            disabledSlots={disabledSlots}
          />
        </div>
      </div>
      {showActions && (
        <>
          <DsSeparator />
          <div className="flex items-center justify-end gap-2 px-4 py-3">
            <DsButton variant="ghost" size="sm" onClick={onCancel}>
              {cancelLabel}
            </DsButton>
            <DsButton size="sm" onClick={onConfirm}>
              {confirmLabel}
            </DsButton>
          </div>
        </>
      )}
    </div>
  );
}

export { DsDateTimePicker, type DsDateTimePickerProps };
