import { cn } from "@/lib/utils";
import { DsLogo } from "@/design-system/navigation";

interface DsAuthLayoutProps {
  children: React.ReactNode;
  footer?: string;
  className?: string;
}

function DsAuthLayout({
  children,
  footer = `©${new Date().getFullYear()} Nova Rio Pay Per Use`,
  className,
}: DsAuthLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col items-center px-4 py-12", className)}>
      <DsLogo className="mb-12" />
      <div className="flex w-full max-w-147.25 flex-col items-center gap-12">{children}</div>
      <p className="mt-auto pt-12 text-base leading-normal tracking-[-0.64px] text-[#4d4d4f]">
        {footer}
      </p>
    </div>
  );
}

export { DsAuthLayout, type DsAuthLayoutProps };
