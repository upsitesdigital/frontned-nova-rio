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

interface DsSelectOption {
  value: string;
  label: string;
  secondaryLabel?: string;
}

interface DsSelectProps {
  options: DsSelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

function DsSelect({
  options,
  placeholder,
  value,
  onValueChange,
  className,
  disabled,
  error,
}: DsSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "w-full justify-between rounded-md border-nova-gray-300 bg-white px-4 py-3 text-base leading-normal tracking-[-0.64px] text-black shadow-none data-[size=default]:h-12 [&>svg]:hidden",
          error && "border-nova-error",
          className,
        )}
      >
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
            className="rounded-[10px] px-4 py-3 text-base leading-[1.3] text-nova-gray-700"
          >
            <span className="flex items-center gap-2">
              <span>{option.label}</span>
              {option.secondaryLabel && (
                <span className="text-nova-gray-400">{option.secondaryLabel}</span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { DsSelect, type DsSelectProps, type DsSelectOption };
