import { cva, type VariantProps } from "class-variance-authority";
import { WarningCircle, CheckCircle, Warning, Info } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

type DsAlertVariant = "error" | "warning" | "success" | "info";

const alertVariants = cva(
  "flex flex-col gap-4 rounded-md border p-4 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)]",
  {
    variants: {
      variant: {
        error: "border-nova-error bg-white",
        warning: "border-nova-warning bg-white",
        success: "border-nova-success bg-white",
        info: "border-nova-info bg-white",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  },
);

const titleColorMap: Record<DsAlertVariant, string> = {
  error: "text-nova-error",
  warning: "text-nova-warning",
  success: "text-nova-success",
  info: "text-nova-info",
};

const iconMap: Record<DsAlertVariant, DsIconComponent> = {
  error: WarningCircle,
  warning: Warning,
  success: CheckCircle,
  info: Info,
};

interface DsAlertProps extends VariantProps<typeof alertVariants> {
  title: string;
  description?: string;
  variant?: DsAlertVariant;
  className?: string;
}

function DsAlert({ title, description, variant = "error", className }: DsAlertProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)}>
      <div className="flex items-center gap-2">
        <DsIcon icon={iconMap[variant]} size="lg" className={titleColorMap[variant]} />
        <p className={cn("text-base font-medium leading-[1.3] tracking-[-0.04em]", titleColorMap[variant])}>
          {title}
        </p>
      </div>
      {description && (
        <p className="text-sm leading-normal text-nova-gray-700">{description}</p>
      )}
    </div>
  );
}

export { DsAlert, type DsAlertProps, type DsAlertVariant };
