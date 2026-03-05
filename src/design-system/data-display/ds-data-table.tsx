import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/design-system/ui/table";

interface DsDataTableColumn {
  key: string;
  header: string;
  className?: string;
}

interface DsDataTableProps {
  columns: DsDataTableColumn[];
  data: Record<string, React.ReactNode>[];
  emptyMessage?: string;
  className?: string;
}

function DsDataTable({
  columns,
  data,
  emptyMessage = "No data available.",
  className,
}: DsDataTableProps) {
  return (
    <Table className={cn(className)}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key} className={cn(column.className)}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key} className={cn(column.className)}>
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export { DsDataTable, type DsDataTableProps, type DsDataTableColumn };
