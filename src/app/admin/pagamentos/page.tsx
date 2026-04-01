"use client";

import { useEffect } from "react";
import { DsAlert, DsPageHeader } from "@/design-system";
import { waitForAuthHydration } from "@/stores/auth-store";
import { useAdminPaymentsStore } from "@/stores/admin-payments-store";
import { AdminPaymentDetailsModal } from "./_components/admin-payment-details-modal";
import { AdminPaymentsFilterBar } from "./_components/admin-payments-filter-bar";
import { AdminPaymentsTable } from "./_components/admin-payments-table";

export default function AdminPaymentsPage() {
  const { error, loadPayments } = useAdminPaymentsStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      loadPayments();
    });
  }, [loadPayments]);

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <DsAlert variant="error" title={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-9.25">
      <DsPageHeader title="Pagamentos" subtitle="Visão geral das transações." />

      <div className="flex flex-col gap-6 overflow-clip rounded-4xl border border-nova-gray-100 bg-white px-6 pt-8 pb-8">
        <AdminPaymentsFilterBar />
        <AdminPaymentsTable />
      </div>

      <AdminPaymentDetailsModal />
    </div>
  );
}
