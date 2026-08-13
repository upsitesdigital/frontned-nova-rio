import { cn } from "@/lib/core/utils";

type DsAppointmentTableColumn = {
  label: string;
  align?: "right";
};

interface DsAppointmentTableHeaderProps {
  columns: DsAppointmentTableColumn[];
  className?: string;
}

function DsAppointmentTableHeader({ columns, className }: DsAppointmentTableHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4 p-4", className)}>
      {columns.map((col) => (
        <p
          key={col.label}
          className={cn(
            "flex-1 text-base font-medium leading-[1.3] text-nova-gray-700",
            col.align === "right" && "text-right",
          )}
        >
          {col.label}
        </p>
      ))}
    </div>
  );
}

export {
  DsAppointmentTableHeader,
  type DsAppointmentTableHeaderProps,
  type DsAppointmentTableColumn,
};
