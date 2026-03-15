import { cn } from "@/lib/utils";

interface DsSavedCardListProps {
  children: React.ReactNode;
  className?: string;
}

function DsSavedCardList({ children, className }: DsSavedCardListProps) {
  return <div className={cn("flex flex-col gap-2 rounded-[10px]", className)}>{children}</div>;
}

export { DsSavedCardList, type DsSavedCardListProps };
