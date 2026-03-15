"use client";

import { DsDialog, DsFormField, DsInput, DsButton } from "@/design-system";
import { useEmailChangeStore } from "@/stores/email-change-store";

function EmailChangeDialog() {
  const {
    emailDialogOpen,
    emailChangeStep,
    newEmail,
    emailCode,
    isSaving,
    error,
    closeEmailDialog,
    setNewEmail,
    setEmailCode,
    submitEmailChange,
    submitEmailVerification,
  } = useEmailChangeStore();

  return (
    <DsDialog
      open={emailDialogOpen}
      onOpenChange={closeEmailDialog}
      title="Alterar e-mail"
      description={
        emailChangeStep === "email"
          ? "Digite o novo endereço de e-mail. Enviaremos um código de verificação."
          : "Digite o código de verificação enviado para o novo e-mail."
      }
      footer={
        <div className="flex items-center gap-3">
          <DsButton variant="outline" onClick={closeEmailDialog} disabled={isSaving}>
            Cancelar
          </DsButton>
          {emailChangeStep === "email" ? (
            <DsButton onClick={submitEmailChange} disabled={isSaving || !newEmail.trim()}>
              {isSaving ? "Enviando..." : "Enviar código"}
            </DsButton>
          ) : (
            <DsButton onClick={submitEmailVerification} disabled={isSaving || !emailCode.trim()}>
              {isSaving ? "Verificando..." : "Confirmar"}
            </DsButton>
          )}
        </div>
      }
    >
      {emailChangeStep === "email" ? (
        <DsFormField label="Novo e-mail" error={error ?? undefined}>
          <DsInput
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="novo@email.com"
          />
        </DsFormField>
      ) : (
        <DsFormField label="Código de verificação" error={error ?? undefined}>
          <DsInput
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            placeholder="000000"
          />
        </DsFormField>
      )}
    </DsDialog>
  );
}

export { EmailChangeDialog };
