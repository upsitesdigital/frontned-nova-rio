import { cn } from "@/lib/utils";
import { DsImage } from "@/design-system/media";

interface DsDiscountCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function DsDiscountCard({
  title = "Descontos exclusivos",
  children,
  className,
}: DsDiscountCardProps) {
  return (
    <div className={cn("relative overflow-clip rounded-2xl bg-nova-success", className)}>
      <DsImage
        src="/images/discount-card.png"
        alt=""
        width={210}
        height={210}
        className="pointer-events-none absolute -left-13.25 -top-15.75 size-52.5 object-cover"
        aria-hidden
      />
      <div className="relative flex flex-col gap-1.5 py-6 pl-40.5 pr-6">
        <p className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-white">{title}</p>
        <div className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export { DsDiscountCard, type DsDiscountCardProps };
