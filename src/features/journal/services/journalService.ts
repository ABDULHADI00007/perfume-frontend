import { cache } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";
import {
  BlogPostSummary,
  BlogPostDetail,
  JournalQueryOptions,
} from "../types";

export const journalService = {
  /**
   * Public: List published journal articles with pagination, category filter & search
   */
  async getPublishedPosts(
    options: JournalQueryOptions = {}
  ): Promise<ApiResponse<BlogPostSummary[]>> {
    const params: Record<string, string | number | undefined> = {};

    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;
    if (options.category && options.category.trim()) params.category = options.category.trim();
    if (options.tag && options.tag.trim()) params.tag = options.tag.trim();
    if (options.search && options.search.trim()) params.search = options.search.trim();

    return apiClient<ApiResponse<BlogPostSummary[]>>(API_ENDPOINTS.journal.list, {
      params,
      next: { revalidate: 60 },
    });
  },

  /**
   * Public: Get published article by slug
   */
  getPublishedPostBySlug: cache(async (slug: string): Promise<ApiResponse<BlogPostDetail>> => {
    return apiClient<ApiResponse<BlogPostDetail>>(
      API_ENDPOINTS.journal.detail(slug.toLowerCase().trim()),
      {
        next: { revalidate: 60 },
      }
    );
  }),
};
