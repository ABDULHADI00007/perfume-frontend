import React from "react";
import { Icons } from "@/components/ui/icons";
import { initialCollections } from "@/features/collections/data/collections";

export interface FilterState {
  family: string;
  concentration: string;
  size: string;
  collectionId: string;
}

export interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  showCollectionFilter?: boolean;
  className?: string;
}

const olfactoryFamilies = [
  { id: "all", label: "All Families" },
  { id: "woody oriental", label: "Woody Oriental" },
  { id: "amber woody", label: "Amber Woody" },
  { id: "solar floral", label: "Solar Floral" },
  { id: "oriental amber", label: "Oriental Amber" },
  { id: "citrus aromatic", label: "Citrus Aromatic" },
  { id: "floral rose", label: "Floral Rose" },
  { id: "leather chypre", label: "Leather Chypre" },
  { id: "woody fresh", label: "Woody Fresh" },
];

const concentrations = [
  { id: "all", label: "All Concentrations" },
  { id: "extrait de parfum", label: "Extrait de Parfum (30%)" },
  { id: "eau de parfum", label: "Eau de Parfum (20%)" },
];

const bottleSizes = [
  { id: "all", label: "All Sizes" },
  { id: "50ml", label: "50ml Travel Flacon" },
  { id: "100ml", label: "100ml Signature Flacon" },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  showCollectionFilter = true,
  className = "",
}) => {
  const hasActiveFilters =
    filters.family !== "all" ||
    filters.concentration !== "all" ||
    filters.size !== "all" ||
    filters.collectionId !== "all";

  return (
    <div className={`flex flex-col space-y-8 font-sans ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-foreground">
          Refine By
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] uppercase tracking-wider text-accent hover:text-foreground transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 1. Olfactory Family */}
      <div className="flex flex-col space-y-3">
        <h4 className="text-[11px] uppercase tracking-[0.16em] font-medium text-foreground-muted">
          Olfactory Family
        </h4>
        <div className="flex flex-col space-y-1.5">
          {olfactoryFamilies.map((fam) => {
            const isSelected = filters.family.toLowerCase() === fam.id.toLowerCase();
            return (
              <button
                key={fam.id}
                type="button"
                onClick={() => onFilterChange("family", fam.id)}
                className={`text-left text-xs py-1 px-2 rounded-none transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-subtle/50"
                }`}
              >
                <span>{fam.label}</span>
                {isSelected && <Icons.Check size={13} className="ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Concentration */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-border/60">
        <h4 className="text-[11px] uppercase tracking-[0.16em] font-medium text-foreground-muted">
          Concentration
        </h4>
        <div className="flex flex-col space-y-1.5">
          {concentrations.map((conc) => {
            const isSelected = filters.concentration.toLowerCase() === conc.id.toLowerCase();
            return (
              <button
                key={conc.id}
                type="button"
                onClick={() => onFilterChange("concentration", conc.id)}
                className={`text-left text-xs py-1 px-2 rounded-none transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-subtle/50"
                }`}
              >
                <span>{conc.label}</span>
                {isSelected && <Icons.Check size={13} className="ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bottle Size */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-border/60">
        <h4 className="text-[11px] uppercase tracking-[0.16em] font-medium text-foreground-muted">
          Flacon Size
        </h4>
        <div className="flex flex-col space-y-1.5">
          {bottleSizes.map((sz) => {
            const isSelected = filters.size.toLowerCase() === sz.id.toLowerCase();
            return (
              <button
                key={sz.id}
                type="button"
                onClick={() => onFilterChange("size", sz.id)}
                className={`text-left text-xs py-1 px-2 rounded-none transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-subtle/50"
                }`}
              >
                <span>{sz.label}</span>
                {isSelected && <Icons.Check size={13} className="ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Collection Filter */}
      {showCollectionFilter && (
        <div className="flex flex-col space-y-3 pt-4 border-t border-border/60">
          <h4 className="text-[11px] uppercase tracking-[0.16em] font-medium text-foreground-muted">
            Collection
          </h4>
          <div className="flex flex-col space-y-1.5">
            <button
              type="button"
              onClick={() => onFilterChange("collectionId", "all")}
              className={`text-left text-xs py-1 px-2 rounded-none transition-all flex items-center justify-between ${
                filters.collectionId === "all"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface-subtle/50"
              }`}
            >
              <span>All Collections</span>
              {filters.collectionId === "all" && <Icons.Check size={13} className="ml-1" />}
            </button>
            {initialCollections.map((col) => {
              const isSelected = filters.collectionId === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => onFilterChange("collectionId", col.id)}
                  className={`text-left text-xs py-1 px-2 rounded-none transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-foreground-muted hover:text-foreground hover:bg-surface-subtle/50"
                  }`}
                >
                  <span>{col.title}</span>
                  {isSelected && <Icons.Check size={13} className="ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
