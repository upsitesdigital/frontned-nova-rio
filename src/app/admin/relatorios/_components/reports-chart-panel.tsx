"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileCsvIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsAlert,
  DsChartSection,
  DsLineChart,
  DsLoadingState,
  DsOptionsMenu,
  type DsFilterDropdownOption,
} from "@/design-system";
import {
  useAdminReportsStore,
  type ReportsChartMode,
  type ReportsPeriodFilter,
} from "@/stores/admin-reports-store";

const PERIOD_OPTIONS: DsFilterDropdownOption[] = [
  { value: "30d", label: "Mês" },
  { value: "90d", label: "Trimestre" },
  { value: "180d", label: "Semestre" },
  { value: "365d", label: "Ano" },
];

const compactNumberFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

function buildYAxisTicks(maxValue: number): number[] {
  if (maxValue <= 0) {
    return [0];
  }

  const segments = 4;
  const rawStep = maxValue / segments;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;

  let stepBase = 10;
  if (normalized <= 1) stepBase = 1;
  else if (normalized <= 2) stepBase = 2;
  else if (normalized <= 5) stepBase = 5;

  const step = stepBase * magnitude;

  return Array.from({ length: segments + 1 }, (_, index) => {
    const value = step * index;
    return Number(value.toFixed(2));
  });
}

function formatRevenueAxis(value: number): string {
  if (value <= 0) return "0";
  return compactNumberFormatter.format(value);
}

function formatHoursAxis(value: number): string {
  return `${decimalFormatter.format(value)}h`;
}

function ReportsChartPanel() {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement | null>(null);

  const {
    chartData,
    chartMode,
    periodFilter,
    unitFilter,
    unitOptions,
    isChartLoading,
    isOptionsLoading,
    isExporting,
    chartError,
    setChartMode,
    setPeriodFilter,
    setUnitFilter,
    exportCsv,
  } = useAdminReportsStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!optionsMenuRef.current) return;

      const eventTarget = event.target;
      if (eventTarget instanceof Node && !optionsMenuRef.current.contains(eventTarget)) {
        setIsOptionsMenuOpen(false);
      }
    };

    if (isOptionsMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsMenuOpen]);

  const unitFilterOptions = useMemo<DsFilterDropdownOption[]>(() => {
    const options = unitOptions.map((unit) => ({
      value: String(unit.id),
      label: unit.name,
    }));

    return [{ value: "all", label: "Todas" }, ...options];
  }, [unitOptions]);

  const maxChartValue = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map((point) => point.value));
  }, [chartData]);

  const yAxisTicks = useMemo(() => buildYAxisTicks(maxChartValue), [maxChartValue]);

  return (
    <div className="relative">
      <DsChartSection
        title="Histórico de transações"
        tabs={[
          { label: "Faturamento", value: "revenue" },
          { label: "Horas por serviço", value: "hours" },
        ]}
        activeTab={chartMode}
        onTabChange={(value) => setChartMode(value as ReportsChartMode)}
        filters={[
          {
            label: "Período",
            options: PERIOD_OPTIONS,
            value: periodFilter,
            onValueChange: (value) => setPeriodFilter(value as ReportsPeriodFilter),
          },
          {
            label: "Região",
            options: unitFilterOptions,
            value: unitFilter,
            onValueChange: setUnitFilter,
            placeholder: isOptionsLoading ? "Carregando..." : "Todas",
          },
        ]}
        onOptionsClick={() => setIsOptionsMenuOpen((current) => !current)}
      >
        {isChartLoading ? (
          <DsLoadingState message="Carregando gráfico..." className="py-16" />
        ) : chartError ? (
          <div className="p-6">
            <DsAlert variant="error" title={chartError} />
          </div>
        ) : chartData.length === 0 ? (
          <div className="px-6 py-16 text-center text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            Sem dados para o período selecionado.
          </div>
        ) : (
          <div className="px-4 py-6">
            <DsLineChart
              data={chartData}
              color="#00A77E"
              height={420}
              yAxisTicks={yAxisTicks.length > 1 ? yAxisTicks : undefined}
              yAxisFormatter={chartMode === "revenue" ? formatRevenueAxis : formatHoursAxis}
              tooltipFormatter={(value) =>
                chartMode === "revenue"
                  ? currencyFormatter.format(value)
                  : `${decimalFormatter.format(value)}h`
              }
            />
          </div>
        )}
      </DsChartSection>

      {isOptionsMenuOpen && (
        <div ref={optionsMenuRef} className="absolute top-23 right-8 z-20">
          <DsOptionsMenu
            items={[
              {
                icon: FileCsvIcon,
                label: isExporting ? "Exportando..." : "Exportar",
                onClick: () => {
                  if (isExporting) return;
                  setIsOptionsMenuOpen(false);
                  void exportCsv();
                },
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

export { ReportsChartPanel };