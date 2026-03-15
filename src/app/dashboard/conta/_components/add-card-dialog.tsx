"use client";

import { useMemo } from "react";
import {
  DsDialog,
  DsFormField,
  DsInput,
  DsSelect,
  DsButton,
  DsCheckbox,
  DsLabel,
} from "@/design-system";
import { formatCardNumber } from "@/lib/formatters";
import { getDetectedBrandLabel } from "@/lib/card-format";
import { useCardsStore } from "@/stores/cards-store";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, "0");
  return { value: String(i + 1), label: month };
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

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 15 }, (_, i) => {
      const year = currentYear + i;
      return { value: String(year), label: String(year) };
    });
  }, []);

  const digits = addForm.cardNumber.replace(/\s/g, "");
  const detectedBrand = getDetectedBrandLabel(addForm.cardNumber);

  const isValid =
    digits.length >= 13 &&
    addForm.holderName.trim().length > 0 &&
    addForm.expiryMonth !== "" &&
    addForm.expiryYear !== "" &&
    /^\d{3,4}$/.test(addForm.cvv);

  return (
    <DsDialog
      open={addDialogOpen}
      onOpenChange={(open) => {
        if (!open) closeAddDialog();
      }}
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
        <DsFormField label="Número do cartão" error={addFormErrors.cardNumber}>
          <DsInput
            value={addForm.cardNumber}
            onChange={(e) => setAddFormField("cardNumber", formatCardNumber(e.target.value))}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            inputMode="numeric"
          />
          {detectedBrand && (
            <p className="mt-1 text-xs text-nova-gray-500">Bandeira detectada: {detectedBrand}</p>
          )}
        </DsFormField>

        <DsFormField label="Nome impresso no cartão" error={addFormErrors.holderName}>
          <DsInput
            value={addForm.holderName}
            onChange={(e) => setAddFormField("holderName", e.target.value)}
            placeholder="NOME SOBRENOME"
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
              options={yearOptions}
              placeholder="AAAA"
              value={addForm.expiryYear}
              onValueChange={(v) => setAddFormField("expiryYear", v)}
            />
          </DsFormField>

          <DsFormField label="CVV" error={addFormErrors.cvv} className="w-24">
            <DsInput
              value={addForm.cvv}
              onChange={(e) =>
                setAddFormField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="000"
              maxLength={4}
              inputMode="numeric"
              type="password"
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
