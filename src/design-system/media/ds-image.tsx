import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type DsImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
};

const roundedMap: Record<NonNullable<DsImageProps["rounded"]>, string> = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

function DsImage({ className, rounded = "none", alt, ...props }: DsImageProps) {
  return <Image alt={alt} className={cn(roundedMap[rounded], className)} {...props} />;
}

export { DsImage, type DsImageProps };
