import { cn } from "@/lib/utils";

interface DsTopbarProps {
  className?: string;
  children: React.ReactNode;
}

function DsTopbar({ className, children }: DsTopbarProps) {
  return (
    <header
      className={cn(
        "h-[var(--topbar-height)] border-b flex items-center justify-between px-6",
        className,
      )}
    >
      {children}
    </header>
  );
}

export { DsTopbar, type DsTopbarProps };
