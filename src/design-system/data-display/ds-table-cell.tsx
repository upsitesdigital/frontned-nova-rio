import { cn } from "@/lib/utils";

type DsTableCellVariant = "body" | "header" | "custom";

interface DsTableCellProps {
  children: React.ReactNode;
  variant?: DsTableCellVariant;
  align?: "start" | "center";
  bold?: boolean;
  className?: string;
}

const textStyles: Record<Exclude<DsTableCellVariant, "custom">, string> = {
  body: "text-base leading-[1.3] tracking-[-0.64px] text-nova-primary-dark",
  header: "text-base font-medium leading-[1.3] text-nova-primary-dark",
};

function DsTableCell({
  children,
  variant = "body",
  align = "center",
  bold = false,
  className,
}: DsTableCellProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center",
        align === "center" && "justify-center",
        className,
      )}
    >
      {variant === "custom" ? (
        children
      ) : (
        <span className={cn(textStyles[variant], bold && "font-medium")}>{children}</span>
      )}
    </div>
  );
}

export { DsTableCell, type DsTableCellProps, type DsTableCellVariant };
