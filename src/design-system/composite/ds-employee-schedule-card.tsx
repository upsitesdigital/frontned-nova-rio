"use client";

import { UsersIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";
import { DsSeparator } from "@/design-system/primitives";
import { DsAgendaCard } from "@/design-system/data-display";

interface DsEmployeeScheduleCardProps {
  name: string;
  icon?: DsIconComponent;
  busyDates?: Date[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  onClose?: () => void;
  className?: string;
}

function DsEmployeeScheduleCard({
  name,
  icon: IconComponent = UsersIcon,
  busyDates,
  selectedDate,
  onDateSelect,
  onMonthChange,
  onClose,
  className,
}: DsEmployeeScheduleCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-6 rounded-2xl border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-nova-info/10">
          <DsIcon icon={IconComponent} size="lg" className="text-nova-info" />
        </div>
        <p className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
          {name}
        </p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-nova-gray-700 transition-colors hover:text-black"
        >
          <DsIcon icon={XIcon} size="lg" />
        </button>
      )}

      <DsSeparator />

      <DsAgendaCard
        busyDates={busyDates}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onMonthChange={onMonthChange}
        className="border-0 p-0"
      />
    </div>
  );
}

export { DsEmployeeScheduleCard, type DsEmployeeScheduleCardProps };
