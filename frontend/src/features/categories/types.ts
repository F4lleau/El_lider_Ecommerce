import type { Product } from "../products/types";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryWithProducts = {
  id: number;
  name: string;
  slug: string;
  products: Product[];
};
