import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/design-system/ui/avatar";

type DsAvatarSize = "sm" | "md" | "lg" | "xl";
type DsAvatarVariant = "default" | "brand";

const sizeMap: Record<DsAvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const fallbackTextSizeMap: Record<DsAvatarSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-2xl tracking-[-0.96px]",
};

const variantMap: Record<DsAvatarVariant, string> = {
  default: "",
  brand: "border border-nova-gray-200 bg-nova-primary text-white",
};

interface DsAvatarProps {
  src?: string;
  fallback: string;
  size?: DsAvatarSize;
  variant?: DsAvatarVariant;
  className?: string;
}

function DsAvatar({ src, fallback, size = "md", variant = "default", className }: DsAvatarProps) {
  return (
    <Avatar className={cn(sizeMap[size], className)}>
      {src && <AvatarImage src={src} alt={fallback} />}
      <AvatarFallback className={cn(variantMap[variant], fallbackTextSizeMap[size])}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}

export { DsAvatar, type DsAvatarProps, type DsAvatarSize, type DsAvatarVariant };
