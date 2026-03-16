"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Matcher } from "react-day-picker";
import { getDefaultClassNames } from "react-day-picker";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/design-system/ui/calendar";
import { DsButton } from "@/design-system/primitives";
import { DsScrollArea } from "@/design-system/primitives";

interface DsAppointmentCalendarProps {
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

function DsAppointmentCalendar({
  date,
  time,
  onDateChange,
  onTimeChange,
  onCancel,
  onConfirm,
  timeSlots = DEFAULT_TIME_SLOTS,
  disabledSlots = [],
  disabledDays,
  disabledDayTooltip,
  cancelLabel = "Cancelar",
  confirmLabel = "Ok",
  className,
}: DsAppointmentCalendarProps) {
  const rdp = getDefaultClassNames();
  const selectedSlotRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedSlotRef.current?.scrollIntoView({ block: "center" });
  }, [time]);

  const setSlotRef = useCallback(
    (slot: string) => (el: HTMLButtonElement | null) => {
      if (slot === time) {
        (selectedSlotRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
      }
    },
    [time],
  );

  return (
    <div
      className={cn(
        "flex w-md flex-col gap-2 rounded-lg border border-nova-gray-200 bg-white p-4",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            disabled={disabledDays}
            disabledDayTooltip={disabledDayTooltip}
            buttonVariant="outline"
            locale={ptBR}
            className="p-0 [--cell-size:36px]"
            components={{
              Chevron: ({ orientation }) => {
                if (orientation === "left") {
                  return <ArrowLeftIcon className="size-4" />;
                }
                return <ArrowRightIcon className="size-4" />;
              },
            }}
            classNames={{
              root: cn("w-[252px]", rdp.root),
              months: cn("flex flex-col relative", rdp.months),
              month: cn("flex flex-col w-full gap-2", rdp.month),
              nav: cn(
                "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
                rdp.nav,
              ),
              month_caption: cn(
                "flex items-center justify-center h-8 w-full px-8",
                rdp.month_caption,
              ),
              caption_label: cn(
                "select-none font-medium text-[15px] capitalize",
                rdp.caption_label,
              ),
              weekdays: cn("flex", rdp.weekdays),
              weekday: cn(
                "flex-1 rounded-md text-center text-[14px] font-normal text-nova-gray-500 capitalize select-none",
                rdp.weekday,
              ),
              week: cn("flex w-full mt-1", rdp.week),
              day: cn(
                "relative w-full h-full p-0 text-center aspect-square select-none",
                "[&:first-child[data-selected=true]_button]:rounded-l-md",
                "[&:last-child[data-selected=true]_button]:rounded-r-md",
                rdp.day,
              ),
              table: "w-full border-collapse",
              today: cn("", rdp.today),
              outside: cn("opacity-30 text-nova-gray-700", rdp.outside),
              disabled: cn("text-muted-foreground opacity-30", rdp.disabled),
              hidden: cn("invisible", rdp.hidden),
              button_previous: cn(
                "flex items-center justify-center size-8 border border-nova-gray-100 rounded-lg bg-white p-0 hover:bg-nova-gray-50 aria-disabled:opacity-50 select-none",
                rdp.button_previous,
              ),
              button_next: cn(
                "flex items-center justify-center size-8 border border-nova-gray-100 rounded-lg bg-white p-0 hover:bg-nova-gray-50 aria-disabled:opacity-50 select-none",
                rdp.button_next,
              ),
            }}
          />
        </div>

        <div className="flex h-70 items-center">
          <div className="h-full w-px bg-nova-gray-100" />
        </div>

        <DsScrollArea className="h-70.5 w-32.5">
          <div className="flex flex-col gap-1.25">
            {timeSlots.map((slot) => {
              const isDisabled = disabledSlots.includes(slot);
              const isSelected = time === slot && !isDisabled;

              return (
                <button
                  key={slot}
                  ref={setSlotRef(slot)}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onTimeChange?.(slot)}
                  className={cn(
                    "flex h-8 w-30 shrink-0 cursor-pointer items-center justify-center rounded-lg px-3 text-[15px] leading-[1.4] transition-colors",
                    isDisabled && "cursor-not-allowed opacity-30",
                    isSelected
                      ? "border border-nova-primary text-foreground"
                      : "border border-nova-gray-300 bg-white text-foreground hover:bg-nova-gray-50",
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </DsScrollArea>
      </div>

      <div className="flex items-end justify-end gap-1.5 border-t border-nova-gray-100 pt-3">
        <DsButton
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="h-8 rounded-lg border-nova-gray-300 px-2 text-[15px] font-medium"
        >
          {cancelLabel}
        </DsButton>
        <DsButton
          size="sm"
          onClick={onConfirm}
          className="h-8 rounded-lg px-2 text-[15px] font-medium"
        >
          {confirmLabel}
        </DsButton>
      </div>
    </div>
  );
}

export { DsAppointmentCalendar, type DsAppointmentCalendarProps };
