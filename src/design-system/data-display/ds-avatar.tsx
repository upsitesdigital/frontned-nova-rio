import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/design-system/ui/avatar";

type DsAvatarSize = "sm" | "md" | "lg";

const sizeMap: Record<DsAvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

interface DsAvatarProps {
  src?: string;
  fallback: string;
  size?: DsAvatarSize;
  className?: string;
}

function DsAvatar({ src, fallback, size = "md", className }: DsAvatarProps) {
  return (
    <Avatar className={cn(sizeMap[size], className)}>
      {src && <AvatarImage src={src} alt={fallback} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

export { DsAvatar, type DsAvatarProps, type DsAvatarSize };
