"use client";

import { DsDialog, DsFormField, DsInput, DsSelect, DsButton, DsCheckbox, DsLabel } from "@/design-system";
import { useCardsStore } from "@/stores/cards-store";

const BRAND_OPTIONS = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "elo", label: "Elo" },
  { value: "amex", label: "American Express" },
  { value: "hipercard", label: "Hipercard" },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, "0");
  return { value: String(i + 1), label: month };
});

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 15 }, (_, i) => {
  const year = currentYear + i;
  return { value: String(year), label: String(year) };
});

function AddCardDialog() {
  const {
    addDialogOpen,
    isAdding,
    addForm,
    addFormErrors,
    closeAddDialog,
    setAddFormField,
    addCard,
  } = useCardsStore();

  const isValid =
    /^\d{4}$/.test(addForm.lastFourDigits) &&
    addForm.holderName.trim().length > 0 &&
    addForm.brand !== "" &&
    addForm.expiryMonth !== "" &&
    addForm.expiryYear !== "";

  return (
    <DsDialog
      open={addDialogOpen}
      onOpenChange={(open) => { if (!open) closeAddDialog(); }}
      title="Adicionar cartão"
      description="Preencha os dados do cartão que deseja cadastrar."
      footer={
        <div className="flex items-center gap-3">
          <DsButton variant="outline" onClick={closeAddDialog} disabled={isAdding}>
            Cancelar
          </DsButton>
          <DsButton onClick={addCard} disabled={isAdding || !isValid}>
            {isAdding ? "Salvando..." : "Salvar cartão"}
          </DsButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <DsFormField label="Últimos 4 dígitos" error={addFormErrors.lastFourDigits}>
          <DsInput
            value={addForm.lastFourDigits}
            onChange={(e) =>
              setAddFormField("lastFourDigits", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="0000"
            maxLength={4}
          />
        </DsFormField>

        <DsFormField label="Nome impresso no cartão" error={addFormErrors.holderName}>
          <DsInput
            value={addForm.holderName}
            onChange={(e) => setAddFormField("holderName", e.target.value)}
            placeholder="NOME SOBRENOME"
          />
        </DsFormField>

        <DsFormField label="Bandeira" error={addFormErrors.brand}>
          <DsSelect
            options={BRAND_OPTIONS}
            placeholder="Selecione a bandeira"
            value={addForm.brand}
            onValueChange={(v) => setAddFormField("brand", v)}
          />
        </DsFormField>

        <div className="flex gap-3">
          <DsFormField label="Mês de validade" error={addFormErrors.expiryMonth} className="flex-1">
            <DsSelect
              options={MONTH_OPTIONS}
              placeholder="MM"
              value={addForm.expiryMonth}
              onValueChange={(v) => setAddFormField("expiryMonth", v)}
            />
          </DsFormField>

          <DsFormField label="Ano de validade" error={addFormErrors.expiryYear} className="flex-1">
            <DsSelect
              options={YEAR_OPTIONS}
              placeholder="AAAA"
              value={addForm.expiryYear}
              onValueChange={(v) => setAddFormField("expiryYear", v)}
            />
          </DsFormField>
        </div>

        <div className="flex items-center gap-2">
          <DsCheckbox
            id="is-default"
            checked={addForm.isDefault}
            onCheckedChange={(checked) => setAddFormField("isDefault", checked === true)}
          />
          <DsLabel htmlFor="is-default" className="cursor-pointer text-sm text-nova-gray-700">
            Definir como cartão padrão
          </DsLabel>
        </div>
      </div>
    </DsDialog>
  );
}

export { AddCardDialog };
