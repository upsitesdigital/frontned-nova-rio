"use client";

import { EyeIcon, PencilSimpleLineIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";
import { DsStatusPill, type DsStatusPillVariant } from "@/design-system/composite/ds-status-pill";

interface DsAppointmentRowProps {
  date: string;
  serviceName: string;
  durationTime: string;
  employeeName: string;
  statusLabel: string;
  statusVariant: DsStatusPillVariant;
  statusIcon: DsIconComponent;
  packageLabel: string;
  onView?: () => void;
  onEdit?: () => void;
  className?: string;
}

function DsAppointmentRow({
  date,
  serviceName,
  durationTime,
  employeeName,
  statusLabel,
  statusVariant,
  statusIcon,
  packageLabel,
  onView,
  onEdit,
  className,
}: DsAppointmentRowProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-md border border-nova-gray-100 bg-white p-4",
        className,
      )}
    >
      <p className="flex-1 text-base leading-normal tracking-[-0.64px] text-nova-gray-700">
        {date}
      </p>
      <p className="flex-1 text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
        {serviceName}
      </p>
      <p className="flex-1 text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
        {durationTime}
      </p>
      <p className="flex-1 text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
        {employeeName}
      </p>
      <div className="flex flex-1 items-center">
        <DsStatusPill icon={statusIcon} label={statusLabel} variant={statusVariant} />
      </div>
      <p className="flex-1 text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
        {packageLabel}
      </p>
      <div className="flex flex-1 items-center justify-end gap-4">
        <button
          type="button"
          onClick={onView}
          disabled={!onView}
          className="cursor-pointer text-nova-gray-700 disabled:cursor-not-allowed disabled:text-nova-gray-300"
        >
          <DsIcon icon={EyeIcon} size="md" />
        </button>
        <button
          type="button"
          onClick={onEdit}
          disabled={!onEdit}
          className="cursor-pointer text-nova-gray-700 disabled:cursor-not-allowed disabled:text-nova-gray-300"
        >
          <DsIcon icon={PencilSimpleLineIcon} size="md" />
        </button>
      </div>
    </div>
  );
}

export { DsAppointmentRow, type DsAppointmentRowProps };
