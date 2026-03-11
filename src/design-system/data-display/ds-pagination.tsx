"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { DsIcon } from "@/design-system/media";

interface DsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function DsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: DsPaginationProps) {
  const showingCount = Math.min(pageSize, totalItems - (currentPage - 1) * pageSize);
  const showingLabel = `Mostrando ${showingCount} de ${totalItems}`;

  return (
    <div className={cn("flex items-center justify-between py-4", className)}>
      <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
        {showingLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex size-5 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
        >
          <DsIcon icon={CaretLeftIcon} size="md" className="text-nova-gray-700" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-1.5 text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-600",
              page === currentPage
                ? "border border-nova-primary bg-white"
                : "bg-white hover:bg-nova-gray-50",
            )}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex size-5 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
        >
          <DsIcon icon={CaretRightIcon} size="md" className="text-nova-gray-700" />
        </button>
      </div>
    </div>
  );
}

export { DsPagination, type DsPaginationProps };
