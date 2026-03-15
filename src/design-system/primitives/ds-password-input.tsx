"use client";

import * as React from "react";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import { Input } from "@/design-system/ui/input";
import { DsIcon } from "@/design-system/media";

type DsPasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  className?: string;
};

function DsPasswordInput({
  visible = false,
  onVisibilityChange,
  className,
  ...props
}: DsPasswordInputProps) {
  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-12", className)} {...props} />
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-nova-gray-400 transition-colors hover:text-foreground"
        onClick={() => onVisibilityChange?.(!visible)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <DsIcon icon={visible ? EyeSlashIcon : EyeIcon} size="md" />
      </button>
    </div>
  );
}

export { DsPasswordInput, type DsPasswordInputProps };
