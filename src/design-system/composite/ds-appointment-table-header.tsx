import { cn } from "@/lib/utils";

interface DsAppointmentTableHeaderProps {
  className?: string;
}

const COLUMNS = [
  { label: "Data" },
  { label: "Serviço" },
  { label: "Duração/ Horário" },
  { label: "Funcionário" },
  { label: "Status" },
  { label: "Pacote" },
  { label: "Ações", align: "right" as const },
];

function DsAppointmentTableHeader({ className }: DsAppointmentTableHeaderProps) {
  return (
    <div className={cn("flex items-center p-4", className)}>
      {COLUMNS.map((col) => (
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

export { DsAppointmentTableHeader, type DsAppointmentTableHeaderProps };
