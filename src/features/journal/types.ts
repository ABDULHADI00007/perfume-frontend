export interface AuthorSummary {
  _id: string;
  name: string;
}

export interface FeaturedImage {
  url?: string;
  altText?: string;
  publicId?: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: FeaturedImage;
  author?: AuthorSummary;
  category?: string;
  tags?: string[];
  seo?: BlogSeo;
  status: "published" | "draft" | "archived";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
}

export interface JournalQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}
