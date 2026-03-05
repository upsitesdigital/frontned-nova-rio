import { EyeIcon, PencilSimpleLineIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsServiceHistoryItemProps {
  date: string;
  label: string;
  onView?: () => void;
  onEdit?: () => void;
  className?: string;
}

function DsServiceHistoryItem({
  date,
  label,
  onView,
  onEdit,
  className,
}: DsServiceHistoryItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border border-nova-gray-100 bg-white px-4 py-3",
        className,
      )}
    >
      <span className="shrink-0 rounded-[6px] bg-nova-gray-50 p-1.5 text-xs leading-[1.3] tracking-[-0.48px] text-[#4d4d4f]">
        {date}
      </span>
      <span className="min-w-0 flex-1 text-base leading-normal tracking-[-0.64px] text-[#4d4d4f]">
        {label}
      </span>
      {onView && (
        <button
          type="button"
          onClick={onView}
          className="shrink-0 cursor-pointer text-nova-gray-400 transition-colors hover:text-nova-gray-700"
        >
          <DsIcon icon={EyeIcon} size="md" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 cursor-pointer text-nova-gray-400 transition-colors hover:text-nova-gray-700"
        >
          <DsIcon icon={PencilSimpleLineIcon} size="md" />
        </button>
      )}
    </div>
  );
}

export { DsServiceHistoryItem, type DsServiceHistoryItemProps };
