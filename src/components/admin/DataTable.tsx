import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/components/ui/icons";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found.",
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto border border-border bg-surface shadow-subtle ${className}`}>
      <table className="w-full text-left text-sm font-sans border-collapse">
        <thead className="border-b border-border bg-surface-subtle text-[10px] uppercase tracking-[0.16em] font-semibold text-foreground-muted">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3.5 font-semibold ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                } ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle text-xs">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-16 text-center text-foreground-muted bg-surface"
              >
                <Spinner size="md" className="mx-auto mb-3 text-foreground-muted" />
                <p className="text-xs uppercase tracking-widest text-foreground-subtle font-medium">
                  Loading records...
                </p>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-16 text-center text-foreground-muted bg-surface"
              >
                <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-surface-subtle border border-border text-foreground-subtle">
                  <Icons.Package size={18} />
                </div>
                <p className="text-xs tracking-wide text-foreground-muted font-medium">
                  {emptyMessage}
                </p>
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr
                key={rIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-150 ${
                  onRowClick
                    ? "cursor-pointer hover:bg-surface-subtle"
                    : "hover:bg-surface-subtle/50"
                }`}
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-4 py-3.5 text-foreground ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    } ${col.className || ""}`}
                  >
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


