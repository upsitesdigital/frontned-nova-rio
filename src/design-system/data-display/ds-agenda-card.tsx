"use client";

import { useState, useMemo, useCallback } from "react";
import {
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  format,
  isWeekend,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DsIconButton } from "@/design-system/primitives";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface DsAgendaCardProps {
  busyDates?: Date[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  className?: string;
}

function DsAgendaCard({
  busyDates = [],
  selectedDate,
  onDateSelect,
  onMonthChange,
  className,
}: DsAgendaCardProps) {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ?? new Date(),
  );

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const busySet = useMemo(() => {
    return new Set(
      busyDates.map((d) => format(d, "yyyy-MM-dd")),
    );
  }, [busyDates]);

  const handlePrevMonth = useCallback(() => {
    const prev = subMonths(currentMonth, 1);
    setCurrentMonth(prev);
    onMonthChange?.(prev);
  }, [currentMonth, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    const next = addMonths(currentMonth, 1);
    setCurrentMonth(next);
    onMonthChange?.(next);
  }, [currentMonth, onMonthChange]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-8 rounded-[20px] border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      <div className="flex w-full items-center">
        <h3 className="text-xl font-medium leading-[1.3] text-black">
          Agenda
        </h3>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <div className="flex items-center gap-px">
          <DsIconButton
            icon={CaretLeftIcon}
            variant="outline"
            size="icon-sm"
            onClick={handlePrevMonth}
            ariaLabel="Mês anterior"
          />
          <span className="flex-1 text-center text-[15px] font-medium leading-[1.4] text-black capitalize">
            {format(currentMonth, "MMMM  yyyy", { locale: ptBR })}
          </span>
          <DsIconButton
            icon={CaretRightIcon}
            variant="outline"
            size="icon-sm"
            onClick={handleNextMonth}
            ariaLabel="Próximo mês"
          />
        </div>

        <div className="flex w-full">
          {WEEKDAY_LABELS.map((day) => (
            <div
              key={day}
              className="flex h-9 flex-1 items-center justify-center text-center text-sm font-normal leading-[1.4] text-nova-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex w-full">
            {week.map((day) => {
              const inMonth = isSameMonth(day, currentMonth);
              const isBusy = busySet.has(format(day, "yyyy-MM-dd"));
              const isSelected =
                selectedDate && isSameDay(day, selectedDate);
              const isWeekendDay = isWeekend(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => onDateSelect?.(day)}
                  className={cn(
                    "flex h-9 flex-1 items-center justify-center rounded-lg text-center text-[15px] font-medium leading-[1.4] transition-colors",
                    !inMonth && "text-nova-gray-200",
                    inMonth && isWeekendDay && "text-nova-gray-200",
                    inMonth && !isWeekendDay && !isBusy && "text-nova-gray-700",
                    inMonth && !isWeekendDay && isBusy && "text-nova-primary",
                    isSelected && "bg-nova-primary-light",
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex w-full items-center justify-center gap-2 rounded-full border border-nova-gray-100 px-6 py-3">
        <div className="flex flex-1 items-center justify-center gap-2">
          <div className="size-3 rounded-full bg-nova-primary" />
          <span className="text-base font-normal leading-normal tracking-[-0.64px] text-black">
            Ocupado
          </span>
        </div>
        <div className="h-4 w-px rotate-0 bg-nova-gray-100" />
        <div className="flex flex-1 items-center justify-center gap-2">
          <div className="size-3 rounded-full bg-nova-gray-700" />
          <span className="text-base font-normal leading-normal tracking-[-0.64px] text-black">
            Livre
          </span>
        </div>
      </div>
    </div>
  );
}

export { DsAgendaCard, type DsAgendaCardProps };
