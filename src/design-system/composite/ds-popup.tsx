import { cn } from "@/lib/utils";

interface DsPopupProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

function DsPopup({ open, children, className }: DsPopupProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-12 overflow-clip rounded-4xl bg-white px-15 py-25 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export { DsPopup, type DsPopupProps };
