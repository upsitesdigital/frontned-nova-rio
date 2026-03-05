import { BellIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsNotificationBellProps {
  count?: number;
  className?: string;
  onClick?: () => void;
}

function DsNotificationBell({ count, className, onClick }: DsNotificationBellProps) {
  const hasNotifications = count !== undefined && count > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-accent",
        className,
      )}
    >
      <DsIcon icon={BellIcon} size="md" />
      {hasNotifications && (
        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

export { DsNotificationBell, type DsNotificationBellProps };
