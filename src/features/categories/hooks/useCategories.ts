"use client";

import { useEffect, useState } from "react";
import { Category } from "../types";
import { categoryService } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
