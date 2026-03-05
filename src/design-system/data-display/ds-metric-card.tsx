import { cn } from "@/lib/utils";

interface DsMetricCardProps {
  label: string;
  value: string;
  className?: string;
}

function DsMetricCard({ label, value, className }: DsMetricCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl bg-nova-gray-50 px-6 py-8",
        className,
      )}
    >
      <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
        {label}
      </span>
      <span className="text-[36px] font-medium leading-[1.3] tracking-[-1.44px] text-nova-gray-700">
        {value}
      </span>
    </div>
  );
}

export { DsMetricCard, type DsMetricCardProps };
