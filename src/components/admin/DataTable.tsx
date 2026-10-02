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
    <div
      className={`w-full overflow-hidden bg-white border-0 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead className="border-b border-[#F0ECE1] bg-[#F8F6F0]/40 text-[11px] uppercase tracking-[0.18em] font-bold text-[#0B1938] font-sans">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-7 py-4 font-bold ${
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
          <tbody className="divide-y divide-[#F0ECE1] text-xs">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-7 py-16 text-center text-[#64748B] bg-white"
                >
                  <Spinner size="md" className="mx-auto mb-3 text-[#0B1938]" />
                  <p className="text-xs uppercase tracking-[0.2em] text-[#64748B] font-bold font-sans">
                    Loading records...
                  </p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-7 py-16 text-center text-[#64748B] bg-white"
                >
                  <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#FAF4E8] text-[#0B1938] shadow-xs border-0">
                    <Icons.Package size={22} />
                  </div>
                  <p className="text-xs sm:text-sm tracking-wide text-[#64748B] font-medium font-sans">
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
                      ? "cursor-pointer hover:bg-[#F8F6F0]/50"
                      : "hover:bg-[#F8F6F0]/30"
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-7 py-4.5 text-[#0B1938] font-sans ${
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
    </div>
  );
}



