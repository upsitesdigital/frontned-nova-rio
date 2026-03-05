"use client";

import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsServiceFormCardProps {
  title?: string;
  subtitle?: string;
  icon: DsIconComponent;
  iconColor?: string;
  iconBgColor?: string;
  onChangeIcon?: () => void;
  changeIconLabel?: string;
  name: string;
  onNameChange: (value: string) => void;
  nameLabel?: string;
  description: string;
  onDescriptionChange: (value: string) => void;
  descriptionLabel?: string;
  price: string;
  onPriceChange: (value: string) => void;
  priceLabel?: string;
  pricePrefix?: string;
  className?: string;
}

function DsServiceFormCard({
  title = "Opções de pagamento",
  subtitle = "Configure quais tipos de pagamento para o serviço.",
  icon,
  iconColor = "text-nova-success",
  iconBgColor = "bg-nova-success/10",
  onChangeIcon,
  changeIconLabel = "Alterar ícone",
  name,
  onNameChange,
  nameLabel = "Nome",
  description,
  onDescriptionChange,
  descriptionLabel = "Descrição",
  price,
  onPriceChange,
  priceLabel = "Preço",
  pricePrefix = "A partir de R$",
  className,
}: DsServiceFormCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-2xl bg-white px-8 py-10",
        className,
      )}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="flex flex-col gap-2 leading-[1.3]">
          {title && (
            <p className="text-2xl font-medium tracking-[-0.96px] text-black">
              {title}
            </p>
          )}
          {subtitle && (
            <p className="text-base tracking-[-0.64px] text-nova-primary-dark">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Form */}
      <div className="flex flex-col gap-8">
        {/* Icon picker */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full",
              iconBgColor,
            )}
          >
            <DsIcon icon={icon} size="lg" className={iconColor} />
          </div>
          {onChangeIcon && (
            <button
              type="button"
              onClick={onChangeIcon}
              className="cursor-pointer rounded-[10px] bg-nova-gray-50 px-4 py-3 text-base font-medium leading-[1.3] text-nova-gray-700 transition-colors hover:bg-nova-gray-100"
            >
              {changeIconLabel}
            </button>
          )}
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <p className="text-lg font-medium leading-[1.5] tracking-[-0.72px] text-nova-gray-700">
            {nameLabel}
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="rounded-[6px] border border-nova-gray-300 px-4 py-3 text-base leading-[1.5] tracking-[-0.64px] text-black outline-none focus:border-nova-primary"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <p className="text-lg font-medium leading-[1.5] tracking-[-0.72px] text-nova-gray-700">
            {descriptionLabel}
          </p>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="h-[100px] resize-none rounded-[6px] border border-nova-gray-300 px-4 py-3 text-base leading-[1.5] text-nova-primary-dark outline-none focus:border-nova-primary"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <p className="text-lg font-medium leading-[1.5] tracking-[-0.72px] text-nova-gray-700">
            {priceLabel}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-primary-dark">
              {pricePrefix}
            </p>
            <input
              type="text"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              className="rounded-[6px] border border-nova-gray-300 px-4 py-3 text-base leading-[1.5] tracking-[-0.64px] text-black outline-none focus:border-nova-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { DsServiceFormCard, type DsServiceFormCardProps };
