"use client";

import { EyeIcon, PencilSimpleLineIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIcon } from "@/design-system/media";

interface DsAgendaListItemProps {
  viewLabel: string;
  editLabel: string;
  date: string;
  label: string;
  clientName?: string;
  onView?: () => void;
  onEdit?: () => void;
  className?: string;
}

function DsAgendaListItem({
  viewLabel,
  editLabel,
  date,
  label,
  clientName,
  onView,
  onEdit,
  className,
}: DsAgendaListItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-md border border-nova-gray-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:gap-3",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="shrink-0 rounded-1.5 bg-nova-gray-50 p-1.5 text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-600">
          {date}
        </span>
        {clientName && (
          <>
            <span className="text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
              {clientName}
            </span>
            <span className="hidden h-4 w-px shrink-0 bg-nova-gray-300 sm:block" />
          </>
        )}
      </div>

      <span className="min-w-0 flex-1 text-base leading-normal tracking-[-0.64px] text-nova-gray-600">
        {label}
      </span>

      <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
        {onView && (
          <button
            type="button"
            onClick={onView}
            aria-label={viewLabel}
            className="shrink-0 cursor-pointer text-nova-gray-400 transition-colors hover:text-nova-gray-700 focus-visible:ring-2 focus-visible:ring-nova-primary focus-visible:outline-none"
          >
            <DsIcon icon={EyeIcon} size="md" />
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={editLabel}
            className="shrink-0 cursor-pointer text-nova-gray-400 transition-colors hover:text-nova-gray-700 focus-visible:ring-2 focus-visible:ring-nova-primary focus-visible:outline-none"
          >
            <DsIcon icon={PencilSimpleLineIcon} size="md" />
          </button>
        )}
      </div>
    </div>
  );
}

export { DsAgendaListItem, type DsAgendaListItemProps };
