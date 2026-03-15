"use client";

import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import * as Collapsible from "@radix-ui/react-collapsible";

interface DsCollapsibleSectionProps {
  icon: DsIconComponent;
  title: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function DsCollapsibleSection({
  icon,
  title,
  open = true,
  onOpenChange,
  children,
  className,
}: DsCollapsibleSectionProps) {
  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange} asChild>
      <div
        className={cn(
          "overflow-clip rounded-[10px] border border-nova-gray-100 p-4",
          className,
        )}
      >
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <DsIcon icon={icon} size="lg" className="shrink-0 text-nova-gray-700" />
              <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                {title}
              </p>
            </div>
            <CaretDownIcon
              size={20}
              weight="bold"
              className={cn(
                "shrink-0 text-nova-gray-700 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </Collapsible.Trigger>
        <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="flex flex-col gap-4 pt-4">{children}</div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}

export { DsCollapsibleSection, type DsCollapsibleSectionProps };
