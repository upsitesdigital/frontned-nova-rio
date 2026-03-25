"use client";

import { useEffect } from "react";
import { DsAlert, DsClientTable, DsPageHeader, type DsClientTableClient } from "@/design-system";
import { useAdminClientsStore } from "@/stores/admin-clients-store";
import { waitForAuthHydration } from "@/stores/auth-store";
import { ClientApprovalModal } from "./_components/client-approval-modal";

export default function AdminClientsPage() {
  const {
    clients,
    isLoading,
    error,
    statusFilter,
    searchQuery,
    selectedClient,
    loadClients,
    setStatusFilter,
    setSearchQuery,
    openApprovalPopup,
    closeApprovalPopup,
    approveSelectedClient,
    rejectSelectedClient,
  } = useAdminClientsStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      loadClients();
    });
  }, [loadClients]);

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
      />
    </div>
  );
}
