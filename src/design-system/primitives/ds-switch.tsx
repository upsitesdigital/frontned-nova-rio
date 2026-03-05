import * as React from "react";

import { cn } from "@/lib/utils";
import { Switch } from "@/design-system/ui/switch";

interface DsSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function DsSwitch({ checked, onCheckedChange, disabled, className, id }: DsSwitchProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(className)}
      id={id}
    />
  );
}

export { DsSwitch, type DsSwitchProps };
