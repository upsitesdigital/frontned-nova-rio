"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

function DsPageHeader({
  title,
  subtitle,
  onBack,
  backLabel = "Voltar",
  className,
}: DsPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1"
        >
          <DsIcon icon={ArrowLeftIcon} size="md" className="text-nova-gray-700" />
          <span className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            {backLabel}
          </span>
        </button>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-semibold leading-[1.3] tracking-[-1.92px] text-black">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export { DsPageHeader, type DsPageHeaderProps };
