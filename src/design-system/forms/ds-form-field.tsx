import { cn } from "@/lib/utils";
import { Label } from "@/design-system/ui/label";

type DsFormFieldErrorVariant = "text" | "pill";

interface DsFormFieldProps {
  label: string;
  error?: string;
  errorVariant?: DsFormFieldErrorVariant;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

function DsFormField({
  label,
  error,
  errorVariant = "text",
  required,
  children,
  className,
  htmlFor,
}: DsFormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error &&
        (errorVariant === "pill" ? (
          <div className="rounded-md bg-nova-error/10 p-2">
            <p className="text-xs leading-[1.3] tracking-[-0.48px] text-black">{error}</p>
          </div>
        ) : (
          <p className="text-xs text-destructive">{error}</p>
        ))}
    </div>
  );
}

export { DsFormField, type DsFormFieldProps };
