import { cn } from "@/lib/core/utils";

interface DsPopupProps {
  open: boolean;
  children: React.ReactNode;
  bare?: boolean;
  className?: string;
}

function DsPopup({ open, children, bare = false, className }: DsPopupProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md",
        className,
      )}
    >
      <div
        className={cn(
          "flex max-h-[90vh] w-full max-w-xl flex-col overflow-y-auto",
          !bare &&
            "items-center gap-8 rounded-4xl bg-white px-6 py-10 shadow-2xl sm:gap-12 sm:px-15 sm:py-25",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { DsPopup, type DsPopupProps };
