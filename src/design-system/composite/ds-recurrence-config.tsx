"use client";

import type { ReactNode } from "react";

import { DsRadioOptionCard, DsSelect } from "@/design-system";

export interface DsRecurrenceConfigOption {
  type: string;
  label: string;
  badge?: string;
}

export interface DsRecurrenceConfigSelectOption {
  value: string;
  label: string;
}

export interface DsRecurrenceConfigProps {
  title: string;
  subtitle: string;
  options: DsRecurrenceConfigOption[];
  selectedType: string | null;
  onSelectType: (type: string) => void;
  selectPlaceholder: string;
  showFrequency: boolean;
  frequencyLabel: string;
  frequencyOptions: DsRecurrenceConfigSelectOption[];
  frequencyValue: string;
  onFrequencyChange: (value: string) => void;
  showWeeklyTimes: boolean;
  weeklyTimesLabel: string;
  weeklyTimesOptions: DsRecurrenceConfigSelectOption[];
  weeklyTimesValue: string;
  onWeeklyTimesChange: (value: string) => void;
  discountNote: ReactNode;
}

const selectClassName =
  "w-full rounded-[6px] border-nova-gray-100 bg-white px-4 py-3 text-base leading-normal tracking-[-0.64px] text-nova-gray-600 shadow-none data-[size=default]:h-auto [&_svg]:size-5 [&_svg]:opacity-100";

export function DsRecurrenceConfig({
  title,
  subtitle,
  options,
  selectedType,
  onSelectType,
  selectPlaceholder,
  showFrequency,
  frequencyLabel,
  frequencyOptions,
  frequencyValue,
  onFrequencyChange,
  showWeeklyTimes,
  weeklyTimesLabel,
  weeklyTimesOptions,
  weeklyTimesValue,
  onWeeklyTimesChange,
  discountNote,
}: DsRecurrenceConfigProps) {
  return (
    <div className="flex w-full flex-col gap-8 rounded-2xl border border-nova-gray-300 px-6 py-8 sm:px-10 sm:py-12">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-medium leading-[1.3] tracking-[-0.96px] text-black">
          {title}
        </h3>
        <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {options.map((option) => (
          <DsRadioOptionCard
            key={option.type}
            label={option.label}
            badge={option.badge}
            selected={selectedType === option.type}
            onClick={() => onSelectType(option.type)}
          />
        ))}
      </div>

      {showFrequency && (
        <div className="flex w-full flex-col gap-4 rounded-[10px] bg-nova-gray-50 p-6">
          <div className="flex flex-col gap-1.5">
            <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
              {frequencyLabel}
            </p>
            <DsSelect
              options={frequencyOptions}
              value={frequencyValue}
              onValueChange={onFrequencyChange}
              placeholder={selectPlaceholder}
              className={selectClassName}
            />
          </div>
          {showWeeklyTimes && (
            <div className="flex flex-col gap-1.5">
              <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                {weeklyTimesLabel}
              </p>
              <DsSelect
                options={weeklyTimesOptions}
                value={weeklyTimesValue}
                onValueChange={onWeeklyTimesChange}
                placeholder={selectPlaceholder}
                className={selectClassName}
              />
            </div>
          )}
          <div className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
            {discountNote}
          </div>
        </div>
      )}
    </div>
  );
}
