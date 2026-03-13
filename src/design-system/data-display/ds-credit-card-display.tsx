"use client";

import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";
import { DsImage } from "@/design-system/media";

type DsCreditCardBrand = "mastercard" | "visa" | "other";

const brandIconMap: Record<DsCreditCardBrand, DsIconComponent | null> = {
  mastercard: null,
  visa: CreditCardIcon,
  other: CreditCardIcon,
};

interface DsCreditCardDisplayProps {
  lastFour: string;
  brand: DsCreditCardBrand;
  className?: string;
}

function DsCreditCardDisplay({ lastFour, brand, className }: DsCreditCardDisplayProps) {
  const icon = brandIconMap[brand];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {brand === "mastercard" ? (
        <DsImage src="/icons/master-card-icon.svg" alt="Mastercard" width={24} height={24} />
      ) : (
        icon && <DsIcon icon={icon} size="lg" />
      )}
      <span className="text-sm text-muted-foreground">**** **** **** {lastFour}</span>
    </div>
  );
}

export { DsCreditCardDisplay, type DsCreditCardDisplayProps, type DsCreditCardBrand };
