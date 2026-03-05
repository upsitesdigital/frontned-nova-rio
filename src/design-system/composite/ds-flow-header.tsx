import { cn } from "@/lib/utils";

interface DsFlowHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

function DsFlowHeader({ title, subtitle, className }: DsFlowHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <h2 className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">{title}</h2>
      {subtitle && <p className="text-base leading-normal text-nova-gray-600">{subtitle}</p>}
    </div>
  );
}

export { DsFlowHeader, type DsFlowHeaderProps };
