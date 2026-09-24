export type ID = string;

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export interface ImageAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}
