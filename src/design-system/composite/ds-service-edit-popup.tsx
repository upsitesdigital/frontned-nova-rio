"use client";

import {
  XIcon,
  FloppyDiskIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";
import { DsSwitch } from "@/design-system/primitives";

interface DsServiceEditPopupFrequency {
  label: string;
  value: string;
  selected: boolean;
}

interface DsServiceEditPopupPaymentOption {
  id: string;
  label: string;
  enabled: boolean;
  frequencies?: DsServiceEditPopupFrequency[];
}

interface DsServiceEditPopupProps {
  onClose?: () => void;
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
  paymentOptionsTitle?: string;
  paymentOptionsDescription?: string;
  paymentOptions: DsServiceEditPopupPaymentOption[];
  onPaymentOptionToggle: (id: string, enabled: boolean) => void;
  onFrequencyToggle: (
    optionId: string,
    frequencyValue: string,
    selected: boolean,
  ) => void;
  onSave: () => void;
  saveLabel?: string;
  saveIcon?: DsIconComponent;
  className?: string;
}

function DsServiceEditPopup({
  onClose,
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
  paymentOptionsTitle = "Opções de pagamento",
  paymentOptionsDescription = "Configure quais tipos de pagamento para o serviço.",
  paymentOptions,
  onPaymentOptionToggle,
  onFrequencyToggle,
  onSave,
  saveLabel = "Salvar alterações",
  saveIcon = FloppyDiskIcon,
  className,
}: DsServiceEditPopupProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-12 bg-white px-[60px] py-[120px]",
        className,
      )}
    >
      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute left-16 top-10 flex size-11 cursor-pointer items-center justify-center rounded-[6px] bg-nova-gray-50 text-nova-gray-700 transition-colors hover:bg-nova-gray-100"
        >
          <DsIcon icon={XIcon} size="lg" />
        </button>
      )}

      {/* Icon + change button */}
      <div className="flex flex-col gap-8">
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

        {/* Form fields */}
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

      {/* Payment options */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 leading-[1.3]">
          <p className="text-2xl font-medium tracking-[-0.96px] text-black">
            {paymentOptionsTitle}
          </p>
          <p className="text-base tracking-[-0.64px] text-nova-primary-dark">
            {paymentOptionsDescription}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex flex-col overflow-clip rounded-[10px] border border-nova-gray-200 p-4",
                option.frequencies && option.enabled && "gap-4",
              )}
            >
              <div className="flex h-6 items-center justify-between">
                <p className="text-base font-medium leading-[1.3] text-black">
                  {option.label}
                </p>
                <DsSwitch
                  checked={option.enabled}
                  onCheckedChange={(checked) =>
                    onPaymentOptionToggle(option.id, checked)
                  }
                />
              </div>

              {option.frequencies && option.enabled && (
                <div className="flex gap-4">
                  {option.frequencies.map((freq) => (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() =>
                        onFrequencyToggle(
                          option.id,
                          freq.value,
                          !freq.selected,
                        )
                      }
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-base font-medium leading-[1.3] text-nova-gray-700 transition-colors",
                        freq.selected
                          ? "border border-nova-success bg-nova-success/10"
                          : "border border-nova-gray-200",
                      )}
                    >
                      {freq.selected && (
                        <DsIcon
                          icon={CheckCircleIcon}
                          size="md"
                          className="text-nova-success"
                        />
                      )}
                      {freq.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={onSave}
        className="flex h-[60px] w-fit cursor-pointer items-center justify-center gap-1 rounded-xl bg-nova-success px-8 py-4 text-lg font-medium leading-[1.5] tracking-[-0.72px] text-white transition-colors hover:bg-nova-success/90"
      >
        <DsIcon icon={saveIcon} size="lg" />
        {saveLabel}
      </button>
    </div>
  );
}

export {
  DsServiceEditPopup,
  type DsServiceEditPopupProps,
  type DsServiceEditPopupPaymentOption,
  type DsServiceEditPopupFrequency,
};
