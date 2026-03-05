import { cn } from "@/lib/utils";

interface DsPageContainerProps {
  className?: string;
  children: React.ReactNode;
}

function DsPageContainer({ className, children }: DsPageContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-[var(--page-padding)]", className)}>{children}</div>
  );
}

export { DsPageContainer, type DsPageContainerProps };
