import * as React from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/design-system/ui/textarea";

type DsTextareaProps = React.ComponentProps<"textarea"> & {
  className?: string;
};

function DsTextarea({ className, ...props }: DsTextareaProps) {
  return <Textarea className={cn(className)} {...props} />;
}

export { DsTextarea, type DsTextareaProps };
