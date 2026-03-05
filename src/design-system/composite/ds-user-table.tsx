"use client";

import {
  Eye,
  PencilSimpleLine,
  Trash,
  Check,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";
import { DsToggleButton } from "@/design-system/primitives";
import { DsSearchInput } from "@/design-system/forms";

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
  { icon: typeof Check; label: string; style: string }
> = {
  active: {
    icon: Check,
    label: "Ativo",
    style: "bg-[rgba(0,167,126,0.1)] text-[#008053]",
  },
  inactive: {
    icon: X,
    label: "Inativo",
    style: "bg-[rgba(219,65,70,0.1)] text-nova-error",
  },
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
        "flex flex-col gap-6 overflow-clip rounded-[20px] border border-nova-gray-100 bg-white px-6 py-8",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <p className="whitespace-nowrap text-xl font-medium leading-[1.3] text-black">
            Usuários
          </p>
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
          className="w-[346px]"
        />
      </div>

      <div className="rounded-[10px] bg-nova-gray-50 p-6">
        <div className="flex items-center p-4">
          {columns.map((col) => (
            <div key={col} className="flex flex-1 items-center justify-center first:justify-start">
              <span className="text-base font-medium leading-[1.3] text-nova-primary-dark">
                {col}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {users.length === 0 ? (
            <div className="rounded-md bg-white p-4 text-center text-base text-nova-gray-400">
              Nenhum usuário encontrado.
            </div>
          ) : (
            users.map((user) => {
              const status = statusConfig[user.status];
              return (
                <div
                  key={user.id}
                  className="flex items-center rounded-md border border-nova-gray-100 bg-white p-4"
                >
                  <div className="flex flex-1 items-center">
                    <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-primary-dark">
                      {user.name}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <span className="text-base leading-normal tracking-[-0.64px] text-nova-primary-dark">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <span className="text-base leading-[1.3] tracking-[-0.64px] text-nova-primary-dark">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-base leading-normal tracking-[-0.64px]",
                        status.style,
                      )}
                    >
                      <DsIcon icon={status.icon} size="sm" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <span className="text-base leading-[1.3] tracking-[-0.64px] text-nova-primary-dark">
                      {user.registrationDate}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <div className="flex items-center gap-4">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(user)}
                          className="cursor-pointer text-nova-gray-700 transition-colors hover:text-black"
                          aria-label={`Visualizar ${user.name}`}
                        >
                          <DsIcon icon={Eye} size="md" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(user)}
                          className="cursor-pointer text-nova-gray-700 transition-colors hover:text-black"
                          aria-label={`Editar ${user.name}`}
                        >
                          <DsIcon icon={PencilSimpleLine} size="md" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          className="cursor-pointer text-nova-gray-700 transition-colors hover:text-nova-error"
                          aria-label={`Excluir ${user.name}`}
                        >
                          <DsIcon icon={Trash} size="lg" />
                        </button>
                      )}
                    </div>
                  </div>
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
