"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch inline-flex shrink-0 items-center rounded-full p-[2px] transition-all outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-nova-primary-light data-[state=unchecked]:bg-nova-gray-50 data-[size=default]:h-[18px] data-[size=default]:w-9 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:bg-nova-primary data-[state=unchecked]:bg-nova-gray-200 group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-2.5 data-[state=checked]:translate-x-[calc(100%+2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
