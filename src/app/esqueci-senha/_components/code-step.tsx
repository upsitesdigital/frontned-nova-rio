"use client";

import { useCallback } from "react";

import { DsButton, DsFormField, DsInput, DsPasswordInput } from "@/design-system";
import { FLOW_INPUT_CLASS } from "@/lib/constants";
import { useForgotPasswordStore } from "@/stores/forgot-password-store";

import { PasswordRequirements } from "./password-requirements";

function CodeStep() {
  const code = useForgotPasswordStore((s) => s.code);
  const newPassword = useForgotPasswordStore((s) => s.newPassword);
  const confirmPassword = useForgotPasswordStore((s) => s.confirmPassword);
  const isSubmitting = useForgotPasswordStore((s) => s.isSubmitting);
  const fieldErrors = useForgotPasswordStore((s) => s.fieldErrors);
  const passwordHints = useForgotPasswordStore((s) => s.passwordHints);

  const setCode = useForgotPasswordStore((s) => s.setCode);
  const setNewPassword = useForgotPasswordStore((s) => s.setNewPassword);
  const setConfirmPassword = useForgotPasswordStore((s) => s.setConfirmPassword);
  const submitCodeStep = useForgotPasswordStore((s) => s.submitCodeStep);

  const canSubmit =
    code.length === 6 &&
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    !isSubmitting;

  const handleSubmit = useCallback(async () => {
    await submitCodeStep();
  }, [submitCodeStep]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <DsFormField label="Código de verificação" error={fieldErrors.code}>
          <DsInput
            type="text"
            inputMode="numeric"
            placeholder="Digite o código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className={FLOW_INPUT_CLASS}
          />
        </DsFormField>

        <div className="flex flex-col gap-1.5">
          <DsFormField label="Nova senha" error={fieldErrors.newPassword}>
            <DsPasswordInput
              placeholder="Digite sua nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={FLOW_INPUT_CLASS}
            />
          </DsFormField>
          <PasswordRequirements hints={passwordHints} />
        </div>

        <DsFormField label="Confirmar senha" error={fieldErrors.confirmPassword}>
          <DsPasswordInput
            placeholder="Confirme sua nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={FLOW_INPUT_CLASS}
          />
        </DsFormField>
      </div>

      <DsButton size="flow" disabled={!canSubmit} onClick={handleSubmit} className="w-64.25">
        {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
      </DsButton>
    </>
  );
}

export { CodeStep };
