"use client";

import { useCallback } from "react";

import { DsButton, DsFormField, DsInput } from "@/design-system";
import { FLOW_INPUT_CLASS } from "@/lib/constants";
import { useForgotPasswordStore } from "@/stores/forgot-password-store";

function EmailStep() {
  const email = useForgotPasswordStore((s) => s.email);
  const isSubmitting = useForgotPasswordStore((s) => s.isSubmitting);
  const setEmail = useForgotPasswordStore((s) => s.setEmail);
  const submitEmailStep = useForgotPasswordStore((s) => s.submitEmailStep);

  const canSubmit = email.trim().length > 0 && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    await submitEmailStep();
  }, [submitEmailStep]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <DsFormField label="E-mail">
          <DsInput
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={FLOW_INPUT_CLASS}
          />
        </DsFormField>
      </div>

      <DsButton
        size="flow"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="w-64.25"
      >
        {isSubmitting ? "Enviando..." : "Enviar código de verificação"}
      </DsButton>
    </>
  );
}

export { EmailStep };
