"use client";

import { DsDialog, DsFormField, DsInput, DsPasswordInput, DsButton } from "@/design-system";
import { useProfileStore } from "@/stores/profile-store";

function PasswordChangeDialog() {
  const {
    passwordDialogOpen,
    passwordChangeStep,
    passwordCode,
    newPassword,
    confirmPassword,
    isSaving,
    error,
    closePasswordDialog,
    setPasswordCode,
    setNewPassword,
    setConfirmPassword,
    submitPasswordChange,
    submitPasswordVerification,
  } = useProfileStore();

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword
      ? "As senhas não coincidem"
      : undefined;

  return (
    <DsDialog
      open={passwordDialogOpen}
      onOpenChange={closePasswordDialog}
      title="Alterar senha"
      description={
        passwordChangeStep === "request"
          ? "Enviaremos um código de verificação para o seu e-mail."
          : "Digite o código recebido e a nova senha."
      }
      footer={
        <div className="flex items-center gap-3">
          <DsButton variant="outline" onClick={closePasswordDialog} disabled={isSaving}>
            Cancelar
          </DsButton>
          {passwordChangeStep === "request" ? (
            <DsButton onClick={submitPasswordChange} disabled={isSaving}>
              {isSaving ? "Enviando..." : "Enviar código"}
            </DsButton>
          ) : (
            <DsButton
              onClick={submitPasswordVerification}
              disabled={
                isSaving ||
                !passwordCode.trim() ||
                !newPassword.trim() ||
                newPassword !== confirmPassword
              }
            >
              {isSaving ? "Alterando..." : "Confirmar"}
            </DsButton>
          )}
        </div>
      }
    >
      {passwordChangeStep === "request" ? (
        <p className="text-base leading-normal text-nova-gray-700">
          Clique em &quot;Enviar código&quot; para receber o código de verificação no seu e-mail
          cadastrado.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <DsFormField label="Código de verificação" error={error ?? undefined}>
            <DsInput
              value={passwordCode}
              onChange={(e) => setPasswordCode(e.target.value)}
              placeholder="000000"
            />
          </DsFormField>

          <DsFormField label="Nova senha">
            <DsPasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
            />
          </DsFormField>

          <DsFormField label="Confirmar senha" error={passwordMismatch}>
            <DsPasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
            />
          </DsFormField>
        </div>
      )}
    </DsDialog>
  );
}

export { PasswordChangeDialog };
