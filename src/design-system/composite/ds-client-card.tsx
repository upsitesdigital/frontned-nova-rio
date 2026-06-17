"use client";

import { EyeIcon, PencilSimpleLineIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";
import { DsStatusPill, type DsStatusPillVariant } from "@/design-system/composite/ds-status-pill";

interface DsClientCardField {
  label: string;
  value: string;
}

interface DsClientCardProps {
  name: string;
  fields: DsClientCardField[];
  statusLabel: string;
  statusVariant: DsStatusPillVariant;
  statusIcon: DsIconComponent;
  onView?: () => void;
  onEdit?: () => void;
  viewLabel: string;
  editLabel: string;
  className?: string;
}

function DsClientCard({
  name,
  fields,
  statusLabel,
  statusVariant,
  statusIcon,
  onView,
  onEdit,
  viewLabel,
  editLabel,
  className,
}: DsClientCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border border-nova-gray-100 bg-white p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-black">{name}</p>
        <DsStatusPill icon={statusIcon} label={statusLabel} variant={statusVariant} />
      </div>

      <div className="flex flex-col gap-1.5">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex items-center justify-between gap-3 text-sm leading-[1.4] tracking-[-0.56px]"
          >
            <span className="shrink-0 text-nova-gray-500">{field.label}</span>
            <span className="truncate text-right font-medium text-nova-gray-700">
              {field.value}
            </span>
          </div>
        ))}
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

export { DsClientCard, type DsClientCardProps, type DsClientCardField };
