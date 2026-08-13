"use client";

import { useEffect } from "react";
import { DsAlert, DsClientTable, DsPageHeader, type DsClientTableClient } from "@/design-system";
import { useAdminClientsStore } from "@/stores/admin/admin-clients-store";
import { waitForAuthHydration } from "@/stores/auth/auth-store";
import { ClientApprovalModal } from "./_components/client-approval-modal";

export default function AdminClientsPage() {
  const {
    clients,
    isLoading,
    error,
    statusFilter,
    searchQuery,
    selectedClient,
    isApproving,
    isRejecting,
    loadClients,
    reset,
    setStatusFilter,
    setSearchQuery,
    openApprovalPopup,
    closeApprovalPopup,
    approveSelectedClient,
    rejectSelectedClient,
  } = useAdminClientsStore();

  useEffect(() => {
    reset();
    waitForAuthHydration().then(() => {
      loadClients();
    });

    return () => {
      reset();
    };
  }, [loadClients, reset]);

  const handleViewClient = (client: DsClientTableClient) => {
    if (client.status === "pending") {
      openApprovalPopup(client);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <DsAlert variant="error" title={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <DsPageHeader title="Clientes" subtitle="Visão geral dos clientes." />

      <DsClientTable
        headerTitle="Clientes"
        searchPlaceholder="Pesquisar"
        clients={clients}
        filter={statusFilter}
        onFilterChange={setStatusFilter}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onView={handleViewClient}
        isLoading={isLoading}
      />

      <ClientApprovalModal
        client={selectedClient}
        onApprove={approveSelectedClient}
        onReject={rejectSelectedClient}
        onClose={closeApprovalPopup}
        disabled={isApproving || isRejecting}
      />
    </div>
  );
}
