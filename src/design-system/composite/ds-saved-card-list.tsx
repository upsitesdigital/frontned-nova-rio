import { cn } from "@/lib/utils";

interface DsSavedCardListProps {
  children: React.ReactNode;
  className?: string;
}

function DsSavedCardList({ children, className }: DsSavedCardListProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-nova-gray-300 bg-nova-gray-50 p-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { DsSavedCardList, type DsSavedCardListProps };
