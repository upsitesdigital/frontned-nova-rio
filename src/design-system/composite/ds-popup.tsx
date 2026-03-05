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
        "fixed inset-0 z-50 flex items-center justify-center",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-12 overflow-clip rounded-[20px] bg-white px-[60px] py-[100px] shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export { DsPopup, type DsPopupProps };
