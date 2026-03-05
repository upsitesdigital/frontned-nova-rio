"use client";

import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";
import { DsSwitch } from "@/design-system/primitives";

interface DsPaymentOptionsCardFrequency {
  label: string;
  value: string;
  selected: boolean;
}

interface DsPaymentOptionsCardOption {
  id: string;
  label: string;
  enabled: boolean;
  frequencies?: DsPaymentOptionsCardFrequency[];
}

interface DsPaymentOptionsCardProps {
  title?: string;
  subtitle?: string;
  options: DsPaymentOptionsCardOption[];
  onOptionToggle: (id: string, enabled: boolean) => void;
  onFrequencyToggle: (
    optionId: string,
    frequencyValue: string,
    selected: boolean,
  ) => void;
  className?: string;
}

function DsPaymentOptionsCard({
  title = "Opções de pagamento",
  subtitle = "Configure quais tipos de pagamento para o serviço.",
  options,
  onOptionToggle,
  onFrequencyToggle,
  className,
}: DsPaymentOptionsCardProps) {
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

      {/* Options */}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
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
                  onOptionToggle(option.id, checked)
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
  );
}

export {
  DsPaymentOptionsCard,
  type DsPaymentOptionsCardProps,
  type DsPaymentOptionsCardOption,
  type DsPaymentOptionsCardFrequency,
};
