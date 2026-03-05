import { cn } from "@/lib/utils";

interface DsRecurrenceCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function DsRecurrenceCard({
  title,
  description,
  children,
  className,
}: DsRecurrenceCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 rounded-[16px] border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-2 leading-[1.3]">
        <p className="text-[20px] font-medium text-black">{title}</p>
        {description && (
          <p className="text-base tracking-[-0.64px] text-nova-gray-700">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4 overflow-clip rounded-[10px] bg-nova-gray-50 p-6">
        {children}
      </div>
    </div>
  );
}

export { DsRecurrenceCard, type DsRecurrenceCardProps };
