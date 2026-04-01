"use client";

import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/design-system/ui/select";

interface DsFilterDropdownOption {
  value: string;
  label: string;
}

interface DsFilterDropdownProps {
  label: string;
  options: DsFilterDropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function DsFilterDropdown({
  label,
  options,
  value,
  onValueChange,
  placeholder,
  className,
}: DsFilterDropdownProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="whitespace-nowrap text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
        {label}
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-auto w-38.5 gap-1 rounded-md border-nova-gray-100 bg-white px-4 py-3 text-base leading-normal tracking-[-0.64px] text-black shadow-none [&>svg]:hidden">
          <SelectValue placeholder={placeholder} />
          <span className="flex shrink-0 items-center">
            <DsIcon icon={CaretDownIcon} size="md" className="text-black" />
          </span>
        </SelectTrigger>
        <SelectContent className="rounded-[10px] border-nova-gray-100 p-2 shadow-[0px_12px_44px_0px_rgba(111,124,142,0.05)]">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="justify-center rounded-[10px] px-6 py-3 pl-6 pr-6 text-base font-medium leading-[1.3] text-nova-gray-700 [&>span:first-child]:hidden"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { DsFilterDropdown, type DsFilterDropdownProps, type DsFilterDropdownOption };
