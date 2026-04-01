"use client";

import { useEffect, useState } from "react";
import { PlusIcon, X } from "@phosphor-icons/react/dist/ssr";
import {
  DsAlert,
  DsButton,
  DsDeleteConfirmPopup,
  DsFormField,
  DsIcon,
  DsInput,
  DsLoadingState,
  DsPageHeader,
  DsUserFormPopup,
  DsUserTable,
  type DsUserTableUser,
} from "@/design-system";
import { waitForAuthHydration } from "@/stores/auth-store";
import {
  useAdminUsersStore,
} from "@/stores/admin-users-store";

const CREATED_ALERT_DURATION = 4000;

function formatDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatRole(role: "ADMIN_MASTER" | "ADMIN_BASIC"): string {
  return role === "ADMIN_MASTER" ? "Admin master" : "Admin basico";
}

export default function AdminUsersPage() {
  const [showCreatedAlert, setShowCreatedAlert] = useState(false);

  const {
    users,
    isLoading,
    isSaving,
    isLoadingDetail,
    deactivatingUserId,
    error,
    detailError,
    filter,
    searchQuery,
    isCreateModalOpen,
    isDetailModalOpen,
    isPasswordVisible,
    selectedUser,
    selectedDeleteUser,
    form,
    loadUsers,
    setFilter,
    setSearchQuery,
    openCreateModal,
    closeCreateModal,
    setPasswordVisible,
    updateFormField,
    createUser,
    openUserDetails,
    closeUserDetails,
    openDeleteConfirm,
    closeDeleteConfirm,
    deactivateSelectedUser,
    reset,
  } = useAdminUsersStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      void loadUsers();
    });

    return () => {
      reset();
    };
  }, [loadUsers, reset]);

  useEffect(() => {
    if (!showCreatedAlert) return;

    const timer = setTimeout(() => {
      setShowCreatedAlert(false);
    }, CREATED_ALERT_DURATION);

    return () => clearTimeout(timer);
  }, [showCreatedAlert]);

  const tableUsers: DsUserTableUser[] = users.map((user) => ({
    id: String(user.id),
    name: user.name,
    role: formatRole(user.role),
    email: user.email,
    status: user.status === "ACTIVE" ? "active" : "inactive",
    registrationDate: formatDate(user.createdAt),
  }));

  const handleCreateUser = async () => {
    if (isSaving) return;

    const created = await createUser();

    if (created) {
      setShowCreatedAlert(true);
    }
  };

  const handleViewUser = (user: DsUserTableUser) => {
    void openUserDetails(Number(user.id));
  };

  const handleEditUser = (user: DsUserTableUser) => {
    void openUserDetails(Number(user.id));
  };

  const handleDeleteUser = (user: DsUserTableUser) => {
    openDeleteConfirm(Number(user.id));
  };

  const isDeletingSelectedUser =
    selectedDeleteUser !== null && deactivatingUserId === selectedDeleteUser.id;

  if (isLoading && tableUsers.length === 0) {
    return <DsLoadingState className="my-20" />;
  }

  return (
    <>
      {showCreatedAlert && (
        <div className="fixed left-1/2 top-4 z-60 w-93 -translate-x-1/2">
          <DsAlert variant="success" title="Usuário criado com sucesso!" />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <DsPageHeader
          title="Usuários"
          subtitle="Crie e edite os usuários do sistema."
          action={
            <DsButton
              variant="default"
              className="flex h-14 items-center justify-center gap-1 rounded-xl bg-nova-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white hover:bg-nova-primary/90"
              onClick={openCreateModal}
            >
              <DsIcon icon={PlusIcon} size="lg" className="text-white" />
              Criar usuário
            </DsButton>
          }
        />

        {error && <DsAlert variant="error" title={error} className="max-w-132" />}

        <DsUserTable
          users={tableUsers}
          filter={filter}
          onFilterChange={setFilter}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={closeCreateModal}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                closeCreateModal();
              }
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar"
          />

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <DsUserFormPopup
              values={form}
              passwordVisible={isPasswordVisible}
              onPasswordVisibilityChange={setPasswordVisible}
              onFieldChange={updateFormField}
              onSave={() => {
                void handleCreateUser();
              }}
              onClose={closeCreateModal}
              saveLabel={isSaving ? "Salvando..." : "Salvar alterações"}
              className="w-full max-w-170"
            />
          </div>
        </div>
      )}

      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={closeUserDetails}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                closeUserDetails();
              }
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar"
          />

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative flex w-full max-w-170 flex-col gap-8 rounded-2xl bg-white p-8">
              <button
                type="button"
                onClick={closeUserDetails}
                className="cursor-pointer text-nova-gray-700 transition-colors hover:text-black"
              >
                <DsIcon icon={X} size="lg" />
              </button>

              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
                  Detalhes do usuário
                </h2>
              </div>

              {isLoadingDetail && <DsLoadingState className="my-8" />}

              {detailError && <DsAlert variant="error" title={detailError} />}

              {selectedUser && !isLoadingDetail && !detailError && (
                <div className="flex flex-col gap-6">
                  <DsFormField label="Nome">
                    <DsInput value={selectedUser.name} readOnly />
                  </DsFormField>

                  <DsFormField label="Email">
                    <DsInput value={selectedUser.email} readOnly />
                  </DsFormField>

                  <div className="flex items-center justify-between gap-8">
                    <DsFormField label="Role" className="w-[288px]">
                      <DsInput value={formatRole(selectedUser.role)} readOnly />
                    </DsFormField>
                    <DsFormField label="Ativo" className="w-[288px]">
                      <DsInput
                        value={selectedUser.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        readOnly
                      />
                    </DsFormField>
                  </div>

                  <DsFormField label="Cadastro">
                    <DsInput value={formatDate(selectedUser.createdAt)} readOnly />
                  </DsFormField>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedDeleteUser && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              if (isDeletingSelectedUser) return;
              closeDeleteConfirm();
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !isDeletingSelectedUser) {
                closeDeleteConfirm();
              }
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar confirmação de exclusão"
          />

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <DsDeleteConfirmPopup
              className="max-w-lg"
              title="Tem certeza que deseja excluir o usuário"
              description="Ao excluir, o usuário será desativado e perderá acesso ao sistema."
              confirmLabel={isDeletingSelectedUser ? "Excluindo..." : "Sim, quero excluir"}
              cancelLabel="Manter o usuário"
              onConfirm={() => {
                void deactivateSelectedUser();
              }}
              onCancel={() => {
                if (isDeletingSelectedUser) return;
                closeDeleteConfirm();
              }}
              onClose={() => {
                if (isDeletingSelectedUser) return;
                closeDeleteConfirm();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}