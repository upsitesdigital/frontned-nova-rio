"use client";

import { cn } from "@/lib/utils";
import { DsSelect, type DsSelectOption } from "@/design-system/primitives";

interface DsServiceInfoField {
  label: string;
  options: DsSelectOption[];
  value?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

interface DsServiceInfoCardProps {
  title?: string;
  fields: DsServiceInfoField[];
  className?: string;
}

function DsServiceInfoCard({
  title = "Informações do serviço",
  fields,
  className,
}: DsServiceInfoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-[10px] border border-nova-gray-200 bg-white p-6",
        className,
      )}
    >
      <p className="text-xl font-medium leading-[1.3] text-black">{title}</p>
      <div className="flex flex-col gap-6">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-3">
            <p className="text-base font-medium leading-[1.3] text-nova-gray-700">
              {field.label}
            </p>
            <DsSelect
              options={field.options}
              value={field.value}
              placeholder={field.placeholder}
              onValueChange={field.onValueChange}
              disabled={field.disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export { DsServiceInfoCard, type DsServiceInfoCardProps, type DsServiceInfoField };
