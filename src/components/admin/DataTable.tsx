"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableSelectCell,
  TableCheckbox,
  TableExpandTriggerCell,
  TableExpandableContent,
  TableDensity,
  SortDirection,
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
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  density?: TableDensity;
  stickyHeader?: boolean;
  /** Enable column sorting on columns that have accessorKey or sortable=true */
  sortable?: boolean;
  /** Enable selectable row checkboxes */
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selected: T[]) => void;
  /** Expandable detail drawer */
  renderExpanded?: (row: T) => React.ReactNode;
  getRowId?: (row: T, index: number) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found.",
  emptyIcon,
  onRowClick,
  className = "",
  density = "comfortable",
  stickyHeader = false,
  sortable = true,
  selectable = false,
  selectedRows,
  onSelectionChange,
  renderExpanded,
  getRowId,
}: DataTableProps<T>) {
  // Sort state
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  // Local selection state (if uncontrolled)
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());

  // Expand state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resolveRowId = useCallback(
    (row: T, idx: number): string => {
      if (getRowId) return getRowId(row, idx);
      if (row && typeof row === "object" && "id" in row) {
        const idVal = (row as Record<string, unknown>).id;
        if (typeof idVal === "string" || typeof idVal === "number") {
          return String(idVal);
        }
      }
      return String(idx);
    },
    [getRowId]
  );

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  // Process sorting
  const sortedData = useMemo(() => {
    if (!sortable || !sortKey || !sortDir) return data;
    const col = columns.find(
      (c) => String(c.accessorKey || c.header) === sortKey
    );
    if (!col || !col.accessorKey) return data;

    const key = col.accessorKey;
    return [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const strA = String(aVal);
      const strB = String(bVal);
      const cmp = strA.localeCompare(strB, undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortable, sortKey, sortDir, columns]);

  // Handle row selection
  const allIds = useMemo(
    () => sortedData.map((r, i) => resolveRowId(r, i)),
    [sortedData, resolveRowId]
  );

  const effectiveSelectedIds = useMemo(() => {
    if (selectedRows) {
      return new Set(selectedRows.map((r, i) => resolveRowId(r, i)));
    }
    return internalSelectedIds;
  }, [selectedRows, internalSelectedIds, resolveRowId]);

  const allSelected = allIds.length > 0 && allIds.every((id) => effectiveSelectedIds.has(id));
  const isIndeterminate = allIds.some((id) => effectiveSelectedIds.has(id)) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    const nextSet = checked ? new Set(allIds) : new Set<string>();
    setInternalSelectedIds(nextSet);
    if (onSelectionChange) {
      onSelectionChange(checked ? [...sortedData] : []);
    }
  };

  const handleSelectRow = (row: T, id: string, checked: boolean) => {
    const nextSet = new Set(effectiveSelectedIds);
    if (checked) {
      nextSet.add(id);
    } else {
      nextSet.delete(id);
    }
    setInternalSelectedIds(nextSet);
    if (onSelectionChange) {
      const newSelected = sortedData.filter((r, i) => nextSet.has(resolveRowId(r, i)));
      onSelectionChange(newSelected);
    }
  };

  const totalColSpan = columns.length + (selectable ? 1 : 0) + (renderExpanded ? 1 : 0);

  return (
    <div className={cn("w-full transition-all duration-300", className)}>
      <Table density={density} stickyHeader={stickyHeader}>
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 bg-slate-50/70 hover:bg-slate-50/70">
            {selectable && (
              <TableHead className="w-12 px-4 text-center">
                <TableCheckbox
                  checked={allSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={handleSelectAll}
                  ariaLabel="Select all rows"
                />
              </TableHead>
            )}

            {renderExpanded && <TableHead className="w-10 px-2 text-center" />}

            {columns.map((col, idx) => {
              const colKey = String(col.accessorKey || col.header);
              const canSort = sortable && (col.sortable !== false) && Boolean(col.accessorKey);
              const currentDir = sortKey === colKey ? sortDir : null;

              return (
                <TableHead
                  key={idx}
                  sortable={canSort}
                  sortDirection={currentDir}
                  onSort={canSort ? () => handleSort(colKey) : undefined}
                  className={cn(
                    "whitespace-nowrap font-bold text-[11px] uppercase tracking-[0.16em] text-slate-500 font-sans",
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
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody animatedSort={sortable}>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={totalColSpan}
                className="py-20 text-center text-muted-foreground bg-white"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 shadow-xs">
                    <Spinner size="md" className="text-[#0C134F]" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-500 font-sans">
                    Loading data...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={totalColSpan}
                className="py-16 text-center text-muted-foreground bg-white"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200/70 flex items-center justify-center shadow-xs">
                    {emptyIcon || <Icons.Package size={22} />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium tracking-wide font-sans">
                    {emptyMessage}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, rIdx) => {
              const rowId = resolveRowId(row, rIdx);
              const isSelected = effectiveSelectedIds.has(rowId);
              const isExpanded = expandedId === rowId;

              return (
                <React.Fragment key={rowId}>
                  <TableRow
                    selected={isSelected}
                    expanded={isExpanded}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      "group transition-colors duration-150 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {selectable && (
                      <TableSelectCell
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectRow(row, rowId, checked)}
                        ariaLabel={`Select row ${rowId}`}
                      />
                    )}

                    {renderExpanded && (
                      <TableExpandTriggerCell
                        expanded={isExpanded}
                        onToggle={() => setExpandedId(isExpanded ? null : rowId)}
                      />
                    )}

                    {columns.map((col, cIdx) => (
                      <TableCell
                        key={cIdx}
                        className={cn(
                          "text-xs text-[#0C134F] font-sans",
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
                          ? (row[col.accessorKey] as unknown as React.ReactNode)
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>

                  {renderExpanded && (
                    <TableExpandableContent open={isExpanded} colSpan={totalColSpan}>
                      {renderExpanded(row)}
                    </TableExpandableContent>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
