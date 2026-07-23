"use client";

import { XIcon, FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIcon } from "@/design-system/media";
import { DsInput } from "@/design-system/primitives";
import { DsPasswordInput } from "@/design-system/primitives";
import { DsSelect, type DsSelectOption } from "@/design-system/primitives";
import { DsFormField } from "@/design-system/forms";

export interface DsUserFormPopupValues {
  name: string;
  email: string;
  password: string;
  role: string;
  active: string;
}

export interface DsUserFormPopupProps {
  nameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  roleLabel: string;
  activeLabel: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  rolePlaceholder: string;
  statusPlaceholder: string;
  title: string;
  values: DsUserFormPopupValues;
  passwordVisible: boolean;
  onPasswordVisibilityChange: (visible: boolean) => void;
  roleOptions?: readonly DsSelectOption[];
  activeOptions?: readonly DsSelectOption[];
  onFieldChange?: (field: keyof DsUserFormPopupValues, value: string) => void;
  onSave?: () => void;
  onClose?: () => void;
  saveLabel: string;
  className?: string;
}

const defaultRoleOptions: DsSelectOption[] = [
  { value: "admin_master", label: "Admin master" },
  { value: "admin_basic", label: "Admin basico" },
];

const defaultActiveOptions: DsSelectOption[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

export function DsUserFormPopup({
  nameLabel,
  emailLabel,
  passwordLabel,
  roleLabel,
  activeLabel,
  namePlaceholder,
  emailPlaceholder,
  passwordPlaceholder,
  rolePlaceholder,
  statusPlaceholder,
  title,
  values,
  passwordVisible,
  onPasswordVisibilityChange,
  roleOptions = defaultRoleOptions,
  activeOptions = defaultActiveOptions,
  onFieldChange,
  onSave,
  onClose,
  saveLabel,
  className,
}: DsUserFormPopupProps) {
  return (
    <div
      className={cn(
        "relative flex max-h-[90vh] w-full max-w-150 flex-col gap-8 overflow-y-auto rounded-2xl bg-white p-8",
        className,
      )}
    >
      <div className="flex w-full flex-col items-center justify-center">
        <p className="w-full text-center text-2xl font-medium leading-[1.3] tracking-[-1.44px] sm:text-4xl text-black">
          {title}
        </p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer text-nova-gray-700 transition-colors hover:text-black"
        >
          <DsIcon icon={XIcon} size="lg" />
        </button>
      )}

      <DsFormField label={nameLabel}>
        <DsInput
          value={values.name}
          onChange={(e) => onFieldChange?.("name", e.target.value)}
          placeholder={namePlaceholder}
        />
      </DsFormField>

      <DsFormField label={emailLabel}>
        <DsInput
          type="email"
          value={values.email}
          onChange={(e) => onFieldChange?.("email", e.target.value)}
          placeholder={emailPlaceholder}
        />
      </DsFormField>

      <DsFormField label={passwordLabel}>
        <DsPasswordInput
          value={values.password}
          onChange={(e) => onFieldChange?.("password", e.target.value)}
          visible={passwordVisible}
          onVisibilityChange={onPasswordVisibilityChange}
          placeholder={passwordPlaceholder}
        />
      </DsFormField>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <DsFormField label={roleLabel} className="w-full sm:w-62">
          <DsSelect
            options={[...roleOptions]}
            value={values.role}
            onValueChange={(v) => onFieldChange?.("role", v)}
            placeholder={rolePlaceholder}
          />
        </DsFormField>
        <DsFormField label={activeLabel} className="w-full sm:w-62">
          <DsSelect
            options={[...activeOptions]}
            value={values.active}
            onValueChange={(v) => onFieldChange?.("active", v)}
            placeholder={statusPlaceholder}
          />
        </DsFormField>
      </div>

      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className="flex h-15 w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white transition-colors hover:bg-primary/90"
        >
          <DsIcon icon={FloppyDiskIcon} size="lg" />
          {saveLabel}
        </button>
      )}
    </div>
  );
}
