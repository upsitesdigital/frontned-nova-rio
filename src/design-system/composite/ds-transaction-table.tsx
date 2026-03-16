import { cn } from "@/lib/utils";
import { DsEmptyState } from "@/design-system/data-display/ds-empty-state";

interface DsTransactionTableColumn {
  key: string;
  header: string;
  className?: string;
}

interface DsTransactionTableProps {
  columns: DsTransactionTableColumn[];
  data: Record<string, React.ReactNode>[];
  emptyMessage?: string;
  className?: string;
}

function DsTransactionTable({
  columns,
  data,
  emptyMessage = "Nenhuma transação encontrada.",
  className,
}: DsTransactionTableProps) {
  return (
    <div className={cn("rounded-2.5 bg-nova-gray-50 p-6", className)}>
      <div className="flex items-center p-4">
        {columns.map((col) => (
          <div key={col.key} className={cn("flex flex-1 items-center", col.className)}>
            <span className="text-base font-medium leading-[1.3] text-nova-gray-600">
              {col.header}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {data.length === 0 ? (
          <DsEmptyState message={emptyMessage} className="rounded-md bg-white p-4" />
        ) : (
          data.map((row, i) => (
            <div
              key={i}
              className="flex items-center rounded-md border border-nova-gray-100 bg-white p-4"
            >
              {columns.map((col) => (
                <div key={col.key} className={cn("flex flex-1 items-center", col.className)}>
                  {row[col.key]}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export { DsTransactionTable, type DsTransactionTableProps, type DsTransactionTableColumn };
