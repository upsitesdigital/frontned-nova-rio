import { cn } from "@/lib/utils";

interface DsNavLinkProps {
  href: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

function DsNavLink({ href, active = false, className, children }: DsNavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </a>
  );
}

export { DsNavLink, type DsNavLinkProps };
