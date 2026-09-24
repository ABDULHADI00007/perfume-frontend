import { ID, Timestamps } from "@/types/common";

export interface Collection extends Timestamps {
  id: ID;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  featured?: boolean;
}
