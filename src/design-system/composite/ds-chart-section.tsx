"use client";

import { type ReactNode } from "react";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";
import { DsToggleButton } from "@/design-system/primitives";
import {
  DsFilterDropdown,
  type DsFilterDropdownOption,
} from "@/design-system/forms";

interface DsChartSectionTab {
  label: string;
  value: string;
}

interface DsChartSectionFilter {
  label: string;
  options: DsFilterDropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
}

interface DsChartSectionProps {
  title: string;
  tabs?: DsChartSectionTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  filters?: DsChartSectionFilter[];
  onOptionsClick?: () => void;
  children: ReactNode;
  className?: string;
}

function DsChartSection({
  title,
  tabs = [],
  activeTab,
  onTabChange,
  filters = [],
  onOptionsClick,
  children,
  className,
}: DsChartSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-clip rounded-[20px] border border-nova-gray-100 bg-white px-6 py-8",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <p className="text-[20px] font-medium leading-[1.3] text-black">
            {title}
          </p>
          {tabs.length > 0 && (
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <DsToggleButton
                  key={tab.value}
                  label={tab.label}
                  active={activeTab === tab.value}
                  onClick={() => onTabChange?.(tab.value)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-12">
          {filters.length > 0 && (
            <div className="flex items-center gap-6">
              {filters.map((filter) => (
                <DsFilterDropdown
                  key={filter.label}
                  label={filter.label}
                  options={filter.options}
                  value={filter.value}
                  onValueChange={filter.onValueChange}
                  placeholder={filter.placeholder}
                  className={filter.triggerClassName}
                />
              ))}
            </div>
          )}
          {onOptionsClick && (
            <button
              type="button"
              onClick={onOptionsClick}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-nova-gray-300 transition-colors hover:bg-nova-gray-50"
            >
              <DsIcon icon={DotsThreeVerticalIcon} size="lg" />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-[10px] border border-nova-gray-100">
        {children}
      </div>
    </div>
  );
}

export {
  DsChartSection,
  type DsChartSectionProps,
  type DsChartSectionTab,
  type DsChartSectionFilter,
};
