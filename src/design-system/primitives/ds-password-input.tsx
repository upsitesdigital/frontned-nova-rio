"use client";

import * as React from "react";
import { EyeIcon, LockIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Input } from "@/design-system/ui/input";
import { DsIcon } from "@/design-system/media";

type DsPasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  className?: string;
};

function DsPasswordInput({ className, ...props }: DsPasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-10", className)} {...props} />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setVisible((prev) => !prev)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <DsIcon icon={visible ? EyeIcon : LockIcon} size="sm" />
      </button>
    </div>
  );
}

export { DsPasswordInput, type DsPasswordInputProps };
