import * as React from "react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/design-system/ui/checkbox";

interface DsCheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function DsCheckbox({ checked, onCheckedChange, disabled, className, id }: DsCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(className)}
      id={id}
    />
  );
}

export { DsCheckbox, type DsCheckboxProps };
