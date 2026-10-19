import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

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
    <div className={cn("w-full space-y-4", className)}>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#EFECE6] bg-[#F9F8F5]">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={cn(
                  "py-4 px-6 font-bold text-[11px] uppercase tracking-[0.16em] text-[#0B1938]",
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left",
                  col.className
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-16 text-center text-muted-foreground bg-white"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Spinner size="md" className="text-[#0B1938]" />
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#64748B]">
                    Loading data...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-16 text-center text-muted-foreground bg-white"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF4E8] text-[#0B1938] flex items-center justify-center shadow-xs">
                    <Icons.Package size={20} />
                  </div>
                  <p className="text-xs text-[#64748B] font-medium tracking-wide">
                    {emptyMessage}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rIdx) => (
              <TableRow
                key={rIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  "group transition-colors duration-200 border-b border-[#F0ECE1] bg-white hover:bg-[#FAF8F5]/80",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col, cIdx) => (
                  <TableCell
                    key={cIdx}
                    className={cn(
                      "py-4 px-6 text-xs text-[#0B1938] font-sans",
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left",
                      col.className
                    )}
                  >
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? "")
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
