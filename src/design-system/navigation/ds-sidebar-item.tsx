import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsSidebarItemProps {
  icon: DsIconComponent;
  label: string;
  active?: boolean;
  href: string;
  className?: string;
}

function DsSidebarItem({ icon, label, active = false, href, className }: DsSidebarItemProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      <DsIcon icon={icon} size="md" />
      <span>{label}</span>
    </a>
  );
}

export { DsSidebarItem, type DsSidebarItemProps };
