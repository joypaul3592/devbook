"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Pagination } from "../pagination/Pagination";

// ------------------------------------
// Column Type
// ------------------------------------

export interface Column<T> {
  id: keyof T;
  header: string;
  accessor?: (row: T) => unknown;
  cell?: (value: unknown, row: T, rowIndex?: number) => React.ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  className?: string;
}

// ------------------------------------
// Table Props
// ------------------------------------

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];

  pagination?: boolean;
  page?: number;
  setPage?: (page: number) => void;

  limit?: number;
  setLimit?: (limit: number) => void;

  totalData?: number;

  loading?: boolean;
  emptyMessage?: string;

  onRowClick?: (row: T) => void;

  actions?: boolean;

  className?: string;
  rowClass?: string;
  tableClassName?: string;
  paginationClass?: string;

  headerColor?: string;

  bordered?: boolean;
}

// ------------------------------------
// Component
// ------------------------------------

const Table = <T extends Record<string, unknown>>({
  data = [],
  columns = [],
  pagination = true,
  page,
  setPage,
  limit,
  setLimit,
  totalData = 0,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  className,
  rowClass,
  tableClassName,
  paginationClass = "",
  headerColor = "",
  bordered = false,
}: TableProps<T>) => {
  // ------------------------------------
  // Cell renderer
  // ------------------------------------

  const renderCellContent = (row: T, rowIndex: number, column: Column<T>) => {
    const value = column.accessor ? column.accessor(row) : row[column.id];

    return column.cell ? column.cell(value, row, rowIndex) : (value as React.ReactNode);
  };

  // ------------------------------------
  // Header
  // ------------------------------------

  const renderTableHeader = () => (
    <thead className={cn("bg-muted text-muted-foreground", headerColor)}>
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.id)}
            scope="col"
            className={cn(
              "px-4 py-3 text-left text-sm font-medium whitespace-nowrap",
              bordered && "border-r border-border last:border-r-0",
              column.className,
            )}
            style={{
              ...(column.width != null ? { width: column.width } : {}),
              ...(column.minWidth != null ? { minWidth: column.minWidth } : {}),
              ...(column.maxWidth != null ? { maxWidth: column.maxWidth } : {}),
            }}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );

  // ------------------------------------
  // Rows
  // ------------------------------------

  const renderTableRows = () => (
    <tbody className="divide-y divide-border/60">
      {loading ? (
        <tr>
          <td
            colSpan={columns.length}
            role="status"
            aria-live="polite"
            className="px-4 py-10 text-center text-muted-foreground"
          >
            Loading...
          </td>
        </tr>
      ) : data.length === 0 ? (
        <tr>
          <td
            colSpan={columns.length}
            role="status"
            aria-live="polite"
            className="px-4 py-10 text-center text-muted-foreground"
          >
            {emptyMessage}
          </td>
        </tr>
      ) : (
        data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={() => onRowClick?.(row)}
            className={cn(
              "transition-colors",
              onRowClick && "cursor-pointer hover:bg-accent",
              rowClass,
            )}
          >
            {columns.map((column) => (
              <td
                key={`${rowIndex}-${String(column.id)}`}
                className={cn(
                  "px-4 py-3 text-sm text-foreground whitespace-nowrap",
                  bordered && "border-r border-border/60 last:border-r-0",
                )}
                style={{
                  ...(column.width != null ? { width: column.width } : {}),
                  ...(column.minWidth != null ? { minWidth: column.minWidth } : {}),
                  ...(column.maxWidth != null ? { maxWidth: column.maxWidth } : {}),
                }}
              >
                {renderCellContent(row, rowIndex, column)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );

  // ------------------------------------
  // Pagination
  // ------------------------------------

  const handlePageSizeChange = (size: number) => {
    setLimit?.(size);
    setPage?.(1);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Table Wrapper */}
      <div className={cn("w-full overflow-x-auto rounded-md", "ring-1 ring-border/80")}>
        <table className={cn("w-full border-collapse", tableClassName)}>
          {renderTableHeader()}
          {renderTableRows()}
        </table>
      </div>

      {/* Pagination */}
      {pagination && setPage && setLimit && (
        <div className={cn("mt-4", paginationClass)}>
          <Pagination
            totalItems={totalData}
            pageSize={limit ?? 10}
            currentPage={page ?? 1}
            onPageChange={(p: number) => setPage(p)}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeOptions
            align="between"
            size="small"
          />
        </div>
      )}
    </div>
  );
};

export { Table };
