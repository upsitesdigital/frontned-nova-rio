"use client";

import { useRouter } from "next/navigation";
import { DsDialog, DsFormField, DsInput, DsButton } from "@/design-system";
import { useDeleteAccountStore } from "@/stores/delete-account-store";

const CONFIRM_PHRASE = "Apagar minha conta";

function DeleteAccountDialog() {
  const router = useRouter();
  const {
    deleteDialogOpen,
    deletePhrase,
    isSaving,
    error,
    closeDeleteDialog,
    setDeletePhrase,
    submitDeleteAccount,
  } = useDeleteAccountStore();

  const canConfirm = deletePhrase === CONFIRM_PHRASE;

  return (
    <DsDialog
      open={deleteDialogOpen}
      onOpenChange={closeDeleteDialog}
      title="Excluir conta"
      description={`Esta ação é irreversível. Para confirmar, digite "${CONFIRM_PHRASE}" no campo abaixo.`}
      footer={
        <div className="flex items-center gap-3">
          <DsButton variant="outline" onClick={closeDeleteDialog} disabled={isSaving}>
            Cancelar
          </DsButton>
          <DsButton
            variant="destructive"
            onClick={async () => {
              const success = await submitDeleteAccount();
              if (success) router.push("/login");
            }}
            disabled={isSaving || !canConfirm}
          >
            {isSaving ? "Excluindo..." : "Excluir conta"}
          </DsButton>
        </div>
      }
    >
      <DsFormField label="Confirmação" error={error ?? undefined}>
        <DsInput
          value={deletePhrase}
          onChange={(e) => setDeletePhrase(e.target.value)}
          placeholder={CONFIRM_PHRASE}
        />
      </DsFormField>
    </DsDialog>
  );
}

export { DeleteAccountDialog };
