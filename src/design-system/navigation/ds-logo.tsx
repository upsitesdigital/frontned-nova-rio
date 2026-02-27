import { cn } from "@/lib/utils";
import { DsImage } from "@/design-system/media";

interface DsLogoProps {
  className?: string;
}

function DsLogo({ className }: DsLogoProps) {
  return (
    <DsImage
      src="/logo/logo.svg"
      alt="NovaRio logo"
      width={120}
      height={32}
      className={cn(className)}
    />
  );
}

export { DsLogo, type DsLogoProps };
