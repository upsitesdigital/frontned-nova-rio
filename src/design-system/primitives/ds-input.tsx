import * as React from "react";

import { cn } from "@/lib/core/utils";
import { Input } from "@/design-system/ui/input";

type DsInputProps = React.ComponentProps<"input"> & {
  className?: string;
};

function DsInput({ className, ...props }: DsInputProps) {
  return <Input className={cn(className)} {...props} />;
}

export { DsInput, type DsInputProps };
