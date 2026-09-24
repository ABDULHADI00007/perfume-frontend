import { ID, Timestamps } from "@/types/common";

export interface Category extends Timestamps {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}
