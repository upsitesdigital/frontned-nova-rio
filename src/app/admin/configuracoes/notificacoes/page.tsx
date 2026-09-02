"use client";

import { useEffect } from "react";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsAlert,
  DsButton,
  DsCheckbox,
  DsEmptyState,
  DsIcon,
  DsIconButton,
  DsInput,
  DsLoadingState,
  DsPageHeader,
} from "@/design-system";
import { waitForAuthHydration } from "@/stores/auth/auth-store";
import { useAdminNotificationsStore } from "@/stores/admin/admin-notifications-store";
import type { AdminNotificationEvent } from "@/api/admin/admin-notifications-api";

const EVENT_LABELS: Record<AdminNotificationEvent, string> = {
  NEW_CLIENT: "Novo cliente aguardando aprovação",
  NEW_APPOINTMENT: "Novo agendamento criado",
  APPOINTMENT_CANCELLED: "Agendamento cancelado",
  APPOINTMENT_RESCHEDULED: "Agendamento reagendado",
  PAYMENT_RECEIVED: "Pagamento recebido",
  PAYMENT_CANCELLED: "Pagamento cancelado",
  ACCOUNT_DELETED: "Conta de cliente excluída",
};

const ALL_EVENTS = Object.keys(EVENT_LABELS) as AdminNotificationEvent[];

export default function AdminNotificacoesPage() {
  const {
    settings,
    isLoading,
    isSaving,
    error,
    newEmail,
    newEvents,
    isAddingNew,
    load,
    setNewEmail,
    toggleNewEvent,
    openAdd,
    cancelAdd,
    addSetting,
    toggleEvent,
    removeSetting,
    reset,
  } = useAdminNotificationsStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      void load();
    });
    return () => reset();
  }, [load, reset]);

  return (
    <div className="flex flex-col gap-6">
      <DsPageHeader
        title="Notificações por e-mail"
        subtitle="Configure quais endereços recebem alertas automáticos sobre eventos do sistema."
        action={
          !isAddingNew ? (
            <DsButton
              variant="default"
              className="flex h-14 items-center gap-1 rounded-xl bg-nova-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white hover:bg-nova-primary/90"
              onClick={openAdd}
            >
              <DsIcon icon={PlusIcon} size="lg" className="text-white" />
              Adicionar destinatário
            </DsButton>
          ) : null
        }
      />

      {error && <DsAlert variant="error" title={error} className="max-w-2xl" />}

      {/* Formulário de adição */}
      {isAddingNew && (
        <div className="rounded-2xl border border-nova-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-black">Novo destinatário</h2>
          <div className="mb-5 max-w-sm">
            <label className="mb-1.5 block text-sm font-medium text-nova-gray-700">
              E-mail
            </label>
            <DsInput
              type="email"
              placeholder="email@exemplo.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-nova-gray-700">
              Eventos que irá receber
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ALL_EVENTS.map((event) => (
                <label
                  key={event}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-nova-gray-200 px-4 py-3 transition-colors hover:border-nova-primary/40"
                >
                  <DsCheckbox
                    checked={newEvents.includes(event)}
                    onCheckedChange={() => toggleNewEvent(event)}
                  />
                  <span className="text-sm text-nova-gray-800">{EVENT_LABELS[event]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <DsButton
              variant="default"
              className="rounded-xl bg-nova-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-nova-primary/90"
              onClick={() => void addSetting()}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </DsButton>
            <DsButton
              variant="outline"
              className="rounded-xl px-6 py-2.5 text-sm font-medium"
              onClick={cancelAdd}
              disabled={isSaving}
            >
              Cancelar
            </DsButton>
          </div>
        </div>
      )}

      {/* Lista de destinatários */}
      {isLoading ? (
        <DsLoadingState className="my-20" />
      ) : settings.length === 0 && !isAddingNew ? (
        <DsEmptyState
          title="Nenhum destinatário configurado"
          description="Adicione um e-mail para começar a receber notificações automáticas."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="rounded-2xl border border-nova-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-medium text-black">{setting.email}</p>
                <DsIconButton
                  icon={TrashIcon}
                  iconSize="md"
                  ariaLabel="Remover destinatário"
                  variant="ghost"
                  onClick={() => void removeSetting(setting.id)}
                  className="text-nova-error hover:text-nova-error/80"
                />
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {ALL_EVENTS.map((event) => (
                  <label
                    key={event}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-nova-gray-200 px-4 py-3 transition-colors hover:border-nova-primary/40"
                  >
                    <DsCheckbox
                      checked={setting.events.includes(event)}
                      onCheckedChange={() => void toggleEvent(setting.id, event)}
                    />
                    <span className="text-sm text-nova-gray-800">{EVENT_LABELS[event]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
