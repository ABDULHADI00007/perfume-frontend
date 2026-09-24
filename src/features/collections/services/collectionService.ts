import { cache } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";
import { Collection } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCollection(raw: any): Collection {
  if (!raw) return raw;
  return {
    id: String(raw._id || raw.id),
    title: raw.name || raw.title || "Untitled Collection",
    slug: raw.slug || "",
    subtitle: raw.subtitle || "",
    description: raw.description || "",
    heroImage: typeof raw.image === "string" ? raw.image : raw.heroImage || "/images/perfumes/oud-majesty.png",
    featured: Boolean(raw.featured),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export const collectionService = {
  getCollections: cache(async (): Promise<ApiResponse<Collection[]>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient<ApiResponse<any[]>>(API_ENDPOINTS.collections.list);
    if (res.success && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data.map(normalizeCollection),
      };
    }
    return res as unknown as ApiResponse<Collection[]>;
  }),

  getCollectionBySlug: cache(async (slug: string): Promise<ApiResponse<Collection>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient<ApiResponse<any>>(API_ENDPOINTS.collections.detail(slug));
    if (res.success && res.data) {
      return {
        ...res,
        data: normalizeCollection(res.data),
      };
    }
    return res as unknown as ApiResponse<Collection>;
  }),
};
