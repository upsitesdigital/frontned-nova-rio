import { cn } from "@/lib/utils";

interface DsConfigSectionProps {
  bordered?: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

function DsConfigSection({
  bordered = true,
  title,
  subtitle,
  children,
  className,
}: DsConfigSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start",
        bordered ? "gap-8 rounded-2xl border border-nova-gray-300 px-10 py-12" : "gap-6",
        className,
      )}
    >
      <div className="flex flex-col items-start gap-2">
        <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
          {title}
        </h3>
        {subtitle && (
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export { DsConfigSection, type DsConfigSectionProps };
