import { ID, Timestamps } from "@/types/common";

export interface Review extends Timestamps {
  id: ID;
  productId: ID;
  rating: number; // 1-5
  author: string;
  title?: string;
  comment: string;
  isVerified?: boolean;
  helpfulCount?: number;
  customerEmail?: string;
}

export interface CreateReviewInput {
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title?: string;
  comment: string;
}
