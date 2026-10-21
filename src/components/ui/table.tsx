"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type TableDensity = "compact" | "comfortable" | "spacious";
export type SortDirection = "asc" | "desc" | null;

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  stickyHeader?: boolean;
  density?: TableDensity;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  animatedSort?: boolean;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  expanded?: boolean;
  selectable?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  expandable?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
}

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export interface TableExpandableContentProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  open?: boolean;
  colSpan: number;
}

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_MORPH = [0.32, 0.72, 0, 1] as const;
const SORT_LAYOUT_MS = 0.32;

const densityClasses: Record<TableDensity, { head: string; cell: string }> = {
  compact: { head: "h-9 px-4 text-[10.5px]", cell: "h-11 px-4 text-xs" },
  comfortable: { head: "h-11 px-6 text-[11px]", cell: "h-14 px-6 text-xs" },
  spacious: { head: "h-13 px-7 text-xs", cell: "h-16 px-7 text-sm" },
};

type TableContextValue = {
  density: TableDensity;
  stickyHeader: boolean;
  animatedSort: boolean;
  layoutGroupId: string;
};

const TableContext = React.createContext<TableContextValue>({
  density: "comfortable",
  stickyHeader: false,
  animatedSort: false,
  layoutGroupId: "21st-table",
});

function useTableContext() {
  return React.useContext(TableContext);
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest(
      'button, a, input, label, textarea, select, [role="checkbox"], [data-slot="table-select-cell"], [data-prevent-row-action="true"]',
    ),
  );
}

function SortIndicator({ direction }: { direction: SortDirection }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span className="relative inline-flex size-3.5 shrink-0 items-center justify-center overflow-hidden ml-1">
      <AnimatePresence mode="popLayout" initial={false}>
        {direction === "asc" ? (
          <motion.span
            key="asc"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85, y: 3 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.85, y: -3 }}
            transition={{ duration: SORT_LAYOUT_MS, ease: EASE_MORPH }}
            className="absolute inset-0 inline-flex items-center justify-center text-primary"
          >
            <ChevronUp className="size-3.5 stroke-[2.5]" />
          </motion.span>
        ) : direction === "desc" ? (
          <motion.span
            key="desc"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85, y: -3 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.85, y: 3 }}
            transition={{ duration: SORT_LAYOUT_MS, ease: EASE_MORPH }}
            className="absolute inset-0 inline-flex items-center justify-center text-primary"
          >
            <ChevronDown className="size-3.5 stroke-[2.5]" />
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
            transition={{ duration: SORT_LAYOUT_MS * 0.8, ease: EASE_MORPH }}
            className="absolute inset-0 inline-flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors"
          >
            <ChevronsUpDown className="size-3.5 stroke-[1.8]" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, stickyHeader = false, density = "comfortable", children, ...props }, ref) => {
    const layoutGroupId = React.useId();

    return (
      <TableContext.Provider
        value={{
          density,
          stickyHeader,
          animatedSort: false,
          layoutGroupId,
        }}
      >
        <div
          ref={ref}
          data-slot="table"
          data-sticky-header={stickyHeader ? "true" : undefined}
          className={cn(
            "relative w-full overflow-auto rounded-2xl border border-slate-200/80 bg-white",
            "shadow-[0_4px_24px_rgba(12,19,79,0.03),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300",
            className,
          )}
          {...props}
        >
          <table className="w-full caption-bottom border-collapse text-left font-sans">{children}</table>
        </div>
      </TableContext.Provider>
    );
  },
);
Table.displayName = "Table";

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-3 px-4 text-xs text-slate-500 font-sans", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { stickyHeader } = useTableContext();
  return (
    <thead
      ref={ref}
      className={cn(
        "border-b border-slate-200/80 bg-slate-50/75 backdrop-blur-xs text-slate-500",
        stickyHeader && "sticky top-0 z-10 bg-slate-50/95 shadow-xs",
        className,
      )}
      {...props}
    />
  );
});
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, animatedSort = false, children, ...props }, ref) => {
    const parentContext = useTableContext();
    const sortEnabled = animatedSort || parentContext.animatedSort;

    return (
      <TableContext.Provider
        value={{
          ...parentContext,
          animatedSort: sortEnabled,
        }}
      >
        <tbody ref={ref} className={cn("[&_tr:last-child]:border-0 divide-y divide-slate-100", className)} {...props}>
          {sortEnabled ? (
            <LayoutGroup id={parentContext.layoutGroupId}>{children}</LayoutGroup>
          ) : (
            children
          )}
        </tbody>
      </TableContext.Provider>
    );
  },
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-slate-200/80 bg-slate-50/50 font-medium text-slate-700",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      className,
      selected = false,
      expanded = false,
      selectable = false,
      onSelectedChange,
      expandable = false,
      onExpandedChange,
      onClick,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const { animatedSort } = useTableContext();
    const shouldReduceMotion = useReducedMotion();
    const isInteractive = selectable || expandable || Boolean(onClick);

    const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || isInteractiveTarget(event.target)) return;

      if (selectable) {
        onSelectedChange?.(!selected);
      } else if (expandable) {
        onExpandedChange?.(!expanded);
      }
    };

    const sharedClass = cn(
      "border-b border-slate-100 transition-colors duration-200 group",
      "hover:bg-slate-50/70",
      isInteractive && "cursor-pointer",
      selected && "bg-slate-100/70 hover:bg-slate-100/90",
      expanded && !selected && "bg-slate-50/80 hover:bg-slate-50/90",
      className,
    );

    const sharedProps = {
      "data-slot": "table-row",
      "data-selected": selected ? "true" : undefined,
      "data-expanded": expanded ? "true" : undefined,
      "data-selectable": selectable ? "true" : undefined,
      "data-expandable": expandable ? "true" : undefined,
      onClick: handleClick,
      className: sharedClass,
      style: { ["--table-ease-out" as string]: EASE_OUT, ...style },
      ...props,
    };

    if (animatedSort && !shouldReduceMotion) {
      const motionRowProps = sharedProps as React.ComponentPropsWithoutRef<typeof motion.tr>;

      return (
        <motion.tr
          ref={ref}
          {...motionRowProps}
          layout="position"
          transition={{
            layout: { duration: SORT_LAYOUT_MS, ease: EASE_MORPH },
          }}
        >
          {children}
        </motion.tr>
      );
    }

    return (
      <tr ref={ref} {...sharedProps}>
        {children}
      </tr>
    );
  },
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      sortable = false,
      sortDirection = null,
      onSort,
      children,
      "aria-sort": ariaSort,
      ...props
    },
    ref,
  ) => {
    const { density } = useTableContext();
    const isActive = Boolean(sortDirection);
    const resolvedAriaSort =
      sortDirection === "asc"
        ? "ascending"
        : sortDirection === "desc"
          ? "descending"
          : ariaSort;

    const content = (
      <>
        <span className="truncate">{children}</span>
        {sortable ? <SortIndicator direction={sortDirection} /> : null}
      </>
    );

    const sharedClass = cn(
      "relative whitespace-nowrap font-bold uppercase tracking-[0.16em] text-slate-500 font-sans select-none",
      densityClasses[density].head,
      sortable && "cursor-pointer group hover:text-[#0C134F] transition-colors",
      isActive && "text-[#0C134F]",
      className,
    );

    if (sortable) {
      return (
        <th
          ref={ref}
          scope="col"
          data-sort-active={isActive ? "true" : undefined}
          aria-sort={resolvedAriaSort}
          className={sharedClass}
          {...props}
        >
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1.5 text-left font-inherit uppercase tracking-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded py-1 px-0.5"
          >
            {content}
          </button>
        </th>
      );
    }

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={ariaSort}
        className={cn(sharedClass, "align-middle")}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5">{content}</span>
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    const { density, animatedSort } = useTableContext();
    const shouldReduceMotion = useReducedMotion();

    const cellClass = cn(
      "align-middle font-sans text-slate-800",
      densityClasses[density].cell,
      animatedSort &&
        !shouldReduceMotion &&
        "transition-[opacity,transform] duration-200 motion-reduce:transition-none",
      className,
    );

    return <td ref={ref} className={cellClass} {...props} />;
  },
);
TableCell.displayName = "TableCell";

export interface TableSelectCellProps extends Omit<TableCellProps, "children"> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

export function TableCheckbox({
  checked,
  indeterminate,
  onCheckedChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ariaLabel: string;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      data-slot="table-checkbox"
      className={cn(
        "relative inline-grid size-4.5 cursor-pointer place-items-center rounded-md border border-slate-300",
        "bg-white text-white transition-all duration-150",
        "hover:border-slate-400 focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-1",
        (checked || indeterminate) &&
          "border-primary bg-primary text-primary-foreground",
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        aria-label={ariaLabel}
        onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
        className="sr-only"
      />
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
        {indeterminate ? (
          <path
            d="M4 8h8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
        ) : (
          <path
            d="m3.6 8.2 2.8 2.8 6-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        )}
      </svg>
    </label>
  );
}

export const TableSelectCell = React.forwardRef<HTMLTableCellElement, TableSelectCellProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onCheckedChange,
      ariaLabel = "Select row",
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { density } = useTableContext();

    return (
      <td
        ref={ref}
        data-slot="table-select-cell"
        className={cn(
          "w-10",
          densityClasses[density].cell,
          "px-4 text-center",
          className,
        )}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        {...props}
      >
        <TableCheckbox
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={(value) => onCheckedChange?.(value === true)}
          ariaLabel={ariaLabel}
        />
      </td>
    );
  },
);
TableSelectCell.displayName = "TableSelectCell";

export interface TableExpandTriggerCellProps extends TableCellProps {
  expanded?: boolean;
  onToggle?: () => void;
  label?: string;
}

export const TableExpandTriggerCell = React.forwardRef<
  HTMLTableCellElement,
  TableExpandTriggerCellProps
>(({ expanded = false, onToggle, label = "Toggle row details", className, children, onClick, ...props }, ref) => {
  const { density } = useTableContext();

  return (
    <td
      ref={ref}
      data-prevent-row-action="true"
      className={cn(
        "w-10",
        densityClasses[density].cell,
        "px-3 text-center",
        className,
      )}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      {...props}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={label}
        data-prevent-row-action="true"
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-lg",
          "text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        )}
      >
        <ChevronDown
          className={cn(
            "size-4 stroke-[2] transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>
      {children}
    </td>
  );
});
TableExpandTriggerCell.displayName = "TableExpandTriggerCell";

export const TableExpandableContent = React.forwardRef<
  HTMLTableRowElement,
  TableExpandableContentProps
>(({ className, open = false, colSpan, children, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      data-slot="table-expandable-content"
      aria-hidden={!open}
      className={cn("border-b border-slate-100 bg-slate-50/50", className)}
      {...props}
    >
      <td colSpan={colSpan} className="p-0">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 py-4 text-xs text-slate-600">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
});
TableExpandableContent.displayName = "TableExpandableContent";
