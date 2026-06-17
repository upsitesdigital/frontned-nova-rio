"use client";

import { EyeIcon, PencilSimpleLineIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";
import { DsStatusPill, type DsStatusPillVariant } from "@/design-system/composite/ds-status-pill";

interface DsAppointmentTabletCardProps {
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
  viewLabel: string;
  editLabel: string;
  className?: string;
}

function DsAppointmentTabletCard({
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
  viewLabel,
  editLabel,
  className,
}: DsAppointmentTabletCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-nova-gray-100 bg-white p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="shrink-0 rounded-1.5 bg-nova-gray-50 px-2 py-1.5 text-sm leading-[1.3] tracking-[-0.56px] text-nova-gray-600">
          {date}
        </span>
        <DsStatusPill icon={statusIcon} label={statusLabel} variant={statusVariant} />
      </div>

      <p className="text-lg font-medium leading-[1.3] tracking-[-0.72px] text-black">
        {serviceName}
      </p>

      <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm leading-[1.4] tracking-[-0.56px] text-nova-gray-700">
        <span>{durationTime}</span>
        <span>{employeeName}</span>
        <span>{packageLabel}</span>
      </div>

      {(onView || onEdit) && (
        <div className="flex items-center justify-end gap-4 border-t border-nova-gray-100 pt-3">
          {onView && (
            <button
              type="button"
              onClick={onView}
              aria-label={viewLabel}
              className="shrink-0 cursor-pointer text-nova-gray-400 transition-colors hover:text-nova-gray-700"
            >
              <DsIcon icon={EyeIcon} size="md" />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={editLabel}
              className="shrink-0 cursor-pointer text-nova-gray-400 transition-colors hover:text-nova-gray-700"
            >
              <DsIcon icon={PencilSimpleLineIcon} size="md" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { DsAppointmentTabletCard, type DsAppointmentTabletCardProps };
