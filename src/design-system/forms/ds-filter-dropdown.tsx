"use client";

import { cn } from "@/lib/utils";
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
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { DsFilterDropdown, type DsFilterDropdownProps, type DsFilterDropdownOption };
