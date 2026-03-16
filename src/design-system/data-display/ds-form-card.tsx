import { cn } from "@/lib/utils";

interface DsFormCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DsFormCard({ title, children, className }: DsFormCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 rounded-4xl border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      <p className="text-xl font-medium leading-[1.3] text-black">{title}</p>
      {children}
    </div>
  );
}

export { DsFormCard, type DsFormCardProps };
