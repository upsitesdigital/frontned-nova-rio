"use client";

import {
  EyeIcon,
  PencilSimpleLineIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIconButton, DsToggleButton } from "@/design-system/primitives";
import { DsSearchInput } from "@/design-system/forms";
import { DsEmptyState } from "@/design-system/data-display/ds-empty-state";
import { DsTableCell } from "@/design-system/data-display/ds-table-cell";
import { DsStatusPill, type DsStatusPillVariant } from "./ds-status-pill";

type DsUserTableFilter = "all" | "active";

type DsUserTableStatus = "active" | "inactive";

interface DsUserTableUser {
  id: string;
  name: string;
  role: string;
  email: string;
  status: DsUserTableStatus;
  registrationDate: string;
}

interface DsUserTableProps {
  users: readonly DsUserTableUser[];
  filter?: DsUserTableFilter;
  onFilterChange?: (filter: DsUserTableFilter) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onView?: (user: DsUserTableUser) => void;
  onEdit?: (user: DsUserTableUser) => void;
  onDelete?: (user: DsUserTableUser) => void;
  className?: string;
}

const statusConfig: Record<
  DsUserTableStatus,
  { icon: typeof CheckIcon; label: string; variant: DsStatusPillVariant }
> = {
  active: { icon: CheckIcon, label: "Ativo", variant: "active" },
  inactive: { icon: XIcon, label: "Inativo", variant: "inactive" },
};

const columns = ["Nome", "Role", "E-mail", "Status", "Cadastro", "Ações"];

function DsUserTable({
  users,
  filter = "all",
  onFilterChange,
  searchValue,
  onSearchChange,
  onView,
  onEdit,
  onDelete,
  className,
}: DsUserTableProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-clip rounded-4xl border border-nova-gray-100 bg-white px-6 py-8",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <p className="whitespace-nowrap text-xl font-medium leading-[1.3] text-black">Usuários</p>
          <div className="flex items-start gap-4">
            <DsToggleButton
              label="Todos"
              active={filter === "all"}
              onClick={() => onFilterChange?.("all")}
            />
            <DsToggleButton
              label="Ativos"
              active={filter === "active"}
              onClick={() => onFilterChange?.("active")}
            />
          </div>
        </div>
        <DsSearchInput
          placeholder="Pesquisar"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-86.5"
        />
      </div>

      <div className="rounded-2.5 bg-nova-gray-50 p-6">
        <div className="flex items-center p-4">
          {columns.map((col, i) => (
            <DsTableCell key={col} variant="header" align={i === 0 ? "start" : "center"}>
              {col}
            </DsTableCell>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {users.length === 0 ? (
            <DsEmptyState
              message="Nenhum usuário encontrado."
              className="rounded-md bg-white p-4"
            />
          ) : (
            users.map((user) => {
              const status = statusConfig[user.status];
              return (
                <div
                  key={user.id}
                  className="flex items-center rounded-md border border-nova-gray-100 bg-white p-4"
                >
                  <DsTableCell align="start" bold>
                    {user.name}
                  </DsTableCell>
                  <DsTableCell>{user.role}</DsTableCell>
                  <DsTableCell>{user.email}</DsTableCell>
                  <DsTableCell variant="custom">
                    <DsStatusPill
                      icon={status.icon}
                      label={status.label}
                      variant={status.variant}
                    />
                  </DsTableCell>
                  <DsTableCell>{user.registrationDate}</DsTableCell>
                  <DsTableCell variant="custom">
                    <div className="flex items-center gap-4">
                      {onView && (
                        <DsIconButton
                          icon={EyeIcon}
                          iconSize="md"
                          variant="ghost"
                          size="icon-sm"
                          ariaLabel={`Visualizar ${user.name}`}
                          onClick={() => onView(user)}
                          className="text-nova-gray-700 hover:bg-transparent hover:text-black"
                        />
                      )}
                      {onEdit && (
                        <DsIconButton
                          icon={PencilSimpleLineIcon}
                          iconSize="md"
                          variant="ghost"
                          size="icon-sm"
                          ariaLabel={`Editar ${user.name}`}
                          onClick={() => onEdit(user)}
                          className="text-nova-gray-700 hover:bg-transparent hover:text-black"
                        />
                      )}
                      {onDelete && (
                        <DsIconButton
                          icon={TrashIcon}
                          iconSize="lg"
                          variant="ghost"
                          size="icon-sm"
                          ariaLabel={`Excluir ${user.name}`}
                          onClick={() => onDelete(user)}
                          className="text-nova-gray-700 hover:bg-transparent hover:text-nova-error"
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
    </div>
  );
}

export {
  DsUserTable,
  type DsUserTableProps,
  type DsUserTableUser,
  type DsUserTableFilter,
  type DsUserTableStatus,
};
