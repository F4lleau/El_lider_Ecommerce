export type ProductImage = {
  id: number;
  productId: number;
  url: string;
  alt: string | null;
  isPrimary: boolean;
};

export type ProductCategorySummary = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  sku: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  isFeatured: boolean;
  isOffer: boolean;
  isNew: boolean;
  isActive: boolean;
  categoryId: number;
  category: ProductCategorySummary;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};
