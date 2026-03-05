"use client";

import { X, FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";
import { DsInput } from "@/design-system/primitives";
import { DsPasswordInput } from "@/design-system/primitives";
import { DsSelect, type DsSelectOption } from "@/design-system/primitives";
import { DsFormField } from "@/design-system/forms";

interface DsUserFormPopupValues {
  name: string;
  email: string;
  password: string;
  role: string;
  active: string;
}

interface DsUserFormPopupProps {
  title?: string;
  values: DsUserFormPopupValues;
  roleOptions?: readonly DsSelectOption[];
  activeOptions?: readonly DsSelectOption[];
  onFieldChange?: (field: keyof DsUserFormPopupValues, value: string) => void;
  onSave?: () => void;
  onClose?: () => void;
  saveLabel?: string;
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

function DsUserFormPopup({
  title = "Criar novo usuario",
  values,
  roleOptions = defaultRoleOptions,
  activeOptions = defaultActiveOptions,
  onFieldChange,
  onSave,
  onClose,
  saveLabel = "Salvar alterações",
  className,
}: DsUserFormPopupProps) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-[600px] flex-col gap-8 rounded-2xl bg-white p-8",
        className,
      )}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-nova-gray-700 transition-colors hover:text-black"
        >
          <DsIcon icon={X} size="lg" />
        </button>
      )}

      <div className="flex w-full flex-col items-center justify-center">
        <p className="w-full text-center text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
          {title}
        </p>
      </div>

      <DsFormField label="Nome">
        <DsInput
          value={values.name}
          onChange={(e) => onFieldChange?.("name", e.target.value)}
          placeholder="Nome do usuário"
        />
      </DsFormField>

      <DsFormField label="Email">
        <DsInput
          type="email"
          value={values.email}
          onChange={(e) => onFieldChange?.("email", e.target.value)}
          placeholder="email@exemplo.com"
        />
      </DsFormField>

      <DsFormField label="Senha">
        <DsPasswordInput
          value={values.password}
          onChange={(e) => onFieldChange?.("password", e.target.value)}
          placeholder="••••••••••••"
        />
      </DsFormField>

      <div className="flex items-center justify-between gap-8">
        <DsFormField label="Role" className="w-[248px]">
          <DsSelect
            options={[...roleOptions]}
            value={values.role}
            onValueChange={(v) => onFieldChange?.("role", v)}
            placeholder="Selecionar role"
          />
        </DsFormField>
        <DsFormField label="Ativo" className="w-[248px]">
          <DsSelect
            options={[...activeOptions]}
            value={values.active}
            onValueChange={(v) => onFieldChange?.("active", v)}
            placeholder="Selecionar status"
          />
        </DsFormField>
      </div>

      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className="flex h-[60px] w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white transition-colors hover:bg-primary/90"
        >
          <DsIcon icon={FloppyDisk} size="lg" />
          {saveLabel}
        </button>
      )}
    </div>
  );
}

export { DsUserFormPopup, type DsUserFormPopupProps, type DsUserFormPopupValues };
