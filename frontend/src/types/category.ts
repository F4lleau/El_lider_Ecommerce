import { LucideIcon } from "lucide-react";
import { Product } from "./product";


export type Category = {
  icon: LucideIcon;
  color: string;
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