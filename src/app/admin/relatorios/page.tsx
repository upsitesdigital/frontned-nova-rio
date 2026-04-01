"use client";

import { useEffect } from "react";
import { DsAlert, DsPageHeader } from "@/design-system";
import { waitForAuthHydration } from "@/stores/auth-store";
import { useAdminReportsStore } from "@/stores/admin-reports-store";
import { ReportsChartPanel } from "./_components/reports-chart-panel";
import { ReportsSummaryCards } from "./_components/reports-summary-cards";

export default function AdminReportsPage() {
  const { error, initialize, reset } = useAdminReportsStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      void initialize();
    });

    return () => {
      reset();
    };
  }, [initialize, reset]);

  return (
    <div className="flex flex-col gap-6">
      <DsPageHeader
        title="Relatórios"
        subtitle="Visão geral das vendas e faturamentos dos serviço."
      />

      {error && <DsAlert variant="error" title={error} className="max-w-132" />}

      <ReportsSummaryCards />
      <ReportsChartPanel />
    </div>
  );
}