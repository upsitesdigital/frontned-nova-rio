"use client";

import { cn } from "@/lib/core/utils";

export interface DsRecordCardField {
  label: string;
  value: React.ReactNode;
}

export interface DsRecordCardProps {
  title: string;
  status?: React.ReactNode;
  fields: DsRecordCardField[];
  actions?: React.ReactNode;
  className?: string;
}

export function DsRecordCard({ title, status, fields, actions, className }: DsRecordCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border border-nova-gray-100 bg-white p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-black">{title}</p>
        {status}
      </div>

      <div className="flex flex-col gap-1.5">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex items-center justify-between gap-3 text-sm leading-[1.4] tracking-[-0.56px]"
          >
            <span className="shrink-0 text-nova-gray-500">{field.label}</span>
            <span className="truncate text-right font-medium text-nova-gray-700">
              {field.value}
            </span>
          </div>
        ))}
      </div>

      {actions && (
        <div className="flex items-center justify-end gap-4 border-t border-nova-gray-100 pt-3">
          {actions}
        </div>
      )}
    </div>
  );
}
