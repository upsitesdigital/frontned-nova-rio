"use client";

import { XIcon } from "@phosphor-icons/react/dist/ssr";
import type { Matcher } from "react-day-picker";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";
import { DsDateTimePicker } from "./ds-date-time-picker";

const DEFAULT_DISABLED_DAYS: Matcher = { dayOfWeek: [0, 6] };
const DEFAULT_DISABLED_TOOLTIP = "Não atendemos aos Sáb, Dom e Feriados";

interface DsSchedulePopupProps {
  open: boolean;
  title?: string;
  date?: Date;
  time?: string;
  onDateChange?: (date: Date | undefined) => void;
  onTimeChange?: (time: string) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
  timeSlots?: string[];
  disabledDays?: Matcher | Matcher[];
  disabledDayTooltip?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  className?: string;
}

function DsSchedulePopup({
  open,
  title = "Escolher data e horário",
  date,
  time,
  onDateChange,
  onTimeChange,
  onCancel,
  onConfirm,
  onClose,
  timeSlots,
  disabledDays = DEFAULT_DISABLED_DAYS,
  disabledDayTooltip = DEFAULT_DISABLED_TOOLTIP,
  cancelLabel,
  confirmLabel,
  className,
}: DsSchedulePopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-nova-gray-900/20"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose?.();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Fechar"
      />

      <div
        className={cn(
          "relative flex flex-col gap-6 rounded-4xl border border-nova-gray-100 bg-white px-6 py-8 shadow-lg shadow-nova-gray-300/10",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-[20px] font-medium leading-[1.3] text-nova-gray-900">{title}</p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-nova-gray-700 transition-colors hover:text-nova-gray-900"
            >
              <DsIcon icon={XIcon} size="lg" />
            </button>
          )}
        </div>

        <DsDateTimePicker
          date={date}
          time={time}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          onCancel={onCancel ?? onClose}
          onConfirm={onConfirm}
          timeSlots={timeSlots}
          disabledDays={disabledDays}
          disabledDayTooltip={disabledDayTooltip}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          className="rounded-2 border-nova-gray-200"
        />
      </div>
    </div>
  );
}

export { DsSchedulePopup, type DsSchedulePopupProps };
