"use client";

import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsEmptyStateProps {
  message: string;
  title?: string;
  actionLabel?: string;
  actionIcon?: DsIconComponent;
  onAction?: () => void;
  className?: string;
}

function DsEmptyState({
  message,
  title,
  actionLabel,
  actionIcon,
  onAction,
  className,
}: DsEmptyStateProps) {
  const hasRichContent = title || actionLabel;

  if (hasRichContent) {
    return (
      <div
        className={cn(
          "flex h-137.5 flex-col items-center justify-center rounded-[10px] bg-nova-gray-50 p-6",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-4 text-center">
            {title && (
              <p className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
                {title}
              </p>
            )}
            <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
              {message}
            </p>
          </div>
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="flex h-14 cursor-pointer items-center justify-center gap-1 rounded-xl bg-nova-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white hover:bg-nova-primary/90"
            >
              {actionIcon && <DsIcon icon={actionIcon} size="lg" className="text-white" />}
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[10px] bg-nova-gray-50 px-6 py-12",
        className,
      )}
    >
      <p className="text-sm text-nova-gray-400">{message}</p>
    </div>
  );
}

export { DsEmptyState, type DsEmptyStateProps };
