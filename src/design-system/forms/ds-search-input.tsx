"use client";

import * as React from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import { Input } from "@/design-system/ui/input";
import { DsIcon } from "@/design-system/media";

interface DsSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

function DsSearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: DsSearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <DsIcon icon={MagnifyingGlassIcon} size="sm" />
      </div>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-9"
      />
    </div>
  );
}

export { DsSearchInput, type DsSearchInputProps };
