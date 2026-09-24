import React from "react";
import { Category } from "../types";

export interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Category Grid Shell */}
    </div>
  );
};
