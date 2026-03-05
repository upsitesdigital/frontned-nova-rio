import { cn } from "@/lib/utils";
import { Label } from "@/design-system/ui/label";

interface DsFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

function DsFormField({ label, error, required, children, className, htmlFor }: DsFormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export { DsFormField, type DsFormFieldProps };
