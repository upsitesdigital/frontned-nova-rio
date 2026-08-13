"use client";

import {
  EyeIcon,
  PencilSimpleLineIcon,
  CheckIcon,
  HourglassIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/core/utils";
import { DsIconButton, DsToggleButton, DsSkeleton } from "@/design-system/primitives";
import { DsSearchInput } from "@/design-system/forms";
import { DsEmptyState } from "@/design-system/data-display/ds-empty-state";
import { DsTableCell } from "@/design-system/data-display/ds-table-cell";
import { DsStatusPill, type DsStatusPillVariant } from "./ds-status-pill";
import { DsClientCard } from "./ds-client-card";

type DsClientTableFilter = "all" | "active" | "pending";

type DsClientTableStatus = "active" | "inactive" | "pending";

interface DsClientTableClient {
  id: string;
  name: string;
  company: string;
  document: string;
  unit: string;
  status: DsClientTableStatus;
  registrationDate: string;
  email: string;
}

interface DsClientTableProps {
  headerTitle: string;
  searchPlaceholder: string;
  clients: readonly DsClientTableClient[];
  filter?: DsClientTableFilter;
  onFilterChange?: (filter: DsClientTableFilter) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onView?: (client: DsClientTableClient) => void;
  onEdit?: (client: DsClientTableClient) => void;
  isLoading?: boolean;
  className?: string;
}

const statusConfig: Record<
  DsClientTableStatus,
  { icon: typeof CheckIcon; label: string; variant: DsStatusPillVariant }
> = {
  active: { icon: CheckIcon, label: "Ativo", variant: "active" },
  inactive: { icon: XIcon, label: "Inativo", variant: "inactive" },
  pending: { icon: HourglassIcon, label: "Pendente", variant: "pending" },
};

const filterButtons: { value: DsClientTableFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "pending", label: "Pendentes" },
];

const columns = [
  { key: "name", header: "Nome do cliente" },
  { key: "company", header: "Empresa" },
  { key: "document", header: "CPF/CNPJ" },
  { key: "unit", header: "Unidade" },
  { key: "status", header: "Status", className: "w-[150px] flex-none" },
  { key: "registration", header: "Cadastro", className: "w-[150px] flex-none" },
  { key: "email", header: "E-mail" },
  { key: "actions", header: "", className: "w-[100px] flex-none" },
];

function DsClientTable({
  headerTitle,
  searchPlaceholder,
  clients,
  filter = "all",
  onFilterChange,
  searchValue,
  onSearchChange,
  onView,
  onEdit,
  isLoading = false,
  className,
}: DsClientTableProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-clip rounded-4xl border border-nova-gray-100 bg-white px-6 py-8",
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12">
          <p className="whitespace-nowrap text-xl font-medium leading-[1.3] text-black">
            {headerTitle}
          </p>
          <div className="flex flex-wrap items-start gap-4">
            {filterButtons.map((btn) => (
              <DsToggleButton
                key={btn.value}
                label={btn.label}
                active={filter === btn.value}
                onClick={() => onFilterChange?.(btn.value)}
              />
            ))}
          </div>
        </div>
        <DsSearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full lg:w-86.5"
        />
      </div>

      <div className="hidden overflow-x-auto rounded-2.5 bg-nova-gray-50 p-6 lg:block">
        <div className="flex min-w-200 items-center p-4">
          {columns.map((col) => (
            <DsTableCell key={col.key} variant="header" align="start" className={col.className}>
              {col.header}
            </DsTableCell>
          ))}
        </div>

        <div className="flex min-w-200 flex-col gap-2">
          {isLoading ? (
            <>
              <DsSkeleton className="h-14 w-full rounded-md" />
              <DsSkeleton className="h-14 w-full rounded-md" />
              <DsSkeleton className="h-14 w-full rounded-md" />
            </>
          ) : clients.length === 0 ? (
            <DsEmptyState
              message="Nenhum cliente encontrado."
              className="rounded-md bg-white p-4"
            />
          ) : (
            clients.map((client) => {
              const status = statusConfig[client.status];
              return (
                <div
                  key={client.id}
                  className="flex items-center rounded-md border border-nova-gray-100 bg-white p-4"
                >
                  <DsTableCell align="start" bold>
                    {client.name}
                  </DsTableCell>
                  <DsTableCell align="start">{client.company}</DsTableCell>
                  <DsTableCell align="start">{client.document}</DsTableCell>
                  <DsTableCell align="start" bold>
                    {client.unit}
                  </DsTableCell>
                  <DsTableCell variant="custom" className="w-37.5 flex-none">
                    <DsStatusPill
                      icon={status.icon}
                      label={status.label}
                      variant={status.variant}
                    />
                  </DsTableCell>
                  <DsTableCell align="start" className="w-37.5 flex-none">
                    {client.registrationDate}
                  </DsTableCell>
                  <DsTableCell align="start">{client.email}</DsTableCell>
                  <DsTableCell variant="custom" className="w-25 flex-none">
                    <div className="flex items-center justify-center gap-4">
                      {onView && (
                        <DsIconButton
                          icon={EyeIcon}
                          iconSize="md"
                          variant="ghost"
                          size="icon-sm"
                          ariaLabel={`Visualizar ${client.name}`}
                          onClick={() => onView(client)}
                          className="text-nova-gray-700 hover:bg-transparent hover:text-black"
                        />
                      )}
                      {onEdit && (
                        <DsIconButton
                          icon={PencilSimpleLineIcon}
                          iconSize="md"
                          variant="ghost"
                          size="icon-sm"
                          ariaLabel={`Editar ${client.name}`}
                          onClick={() => onEdit(client)}
                          className="text-nova-gray-700 hover:bg-transparent hover:text-black"
                        />
                      )}
                    </div>
                  </DsTableCell>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {isLoading ? (
          <>
            <DsSkeleton className="h-40 w-full rounded-md" />
            <DsSkeleton className="h-40 w-full rounded-md" />
          </>
        ) : clients.length === 0 ? (
          <DsEmptyState message="Nenhum cliente encontrado." className="rounded-md bg-white p-4" />
        ) : (
          clients.map((client) => {
            const status = statusConfig[client.status];
            return (
              <DsClientCard
                key={client.id}
                name={client.name}
                statusLabel={status.label}
                statusVariant={status.variant}
                statusIcon={status.icon}
                viewLabel={`Visualizar ${client.name}`}
                editLabel={`Editar ${client.name}`}
                fields={[
                  { label: "Empresa", value: client.company },
                  { label: "CPF/CNPJ", value: client.document },
                  { label: "Unidade", value: client.unit },
                  { label: "Cadastro", value: client.registrationDate },
                  { label: "E-mail", value: client.email },
                ]}
                onView={onView ? () => onView(client) : undefined}
                onEdit={onEdit ? () => onEdit(client) : undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

//! Fix
export {
  DsClientTable,
  type DsClientTableProps,
  type DsClientTableClient,
  type DsClientTableFilter,
  type DsClientTableStatus,
};
