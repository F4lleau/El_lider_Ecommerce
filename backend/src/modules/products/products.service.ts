import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { slugify } from "../../utils/slug.js";
import type { AdminProductsQuery, CreateProductInput, UpdatePriceInput, UpdateProductInput, UpdateStockInput } from "./products.schema.js";

const defaultInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { isPrimary: "desc" as const } },
};

const publicWhere = { isActive: true, category: { isActive: true } };

const ensureCategory = async (categoryId: number) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true, isActive: true } });
  if (!category) throw new ApiError(404, "Categoria no encontrada");
  if (!category.isActive) throw new ApiError(409, "La categoria esta inactiva");
};

const ensureUniqueSlug = async (slug: string, excludeId?: number) => {
  const existing = await prisma.product.findFirst({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) }, select: { id: true } });
  if (existing) throw new ApiError(409, "Ya existe un producto con ese slug");
};

const normalizeSku = (sku: string | null | undefined) => sku?.trim().toUpperCase() || null;

const ensureUniqueSku = async (sku: string | null, excludeId?: number) => {
  if (!sku) return;
  const existing = await prisma.product.findFirst({ where: { sku, ...(excludeId ? { id: { not: excludeId } } : {}) }, select: { id: true } });
  if (existing) throw new ApiError(409, "Ya existe un producto con ese SKU");
};

const list = () => prisma.product.findMany({ where: publicWhere, include: defaultInclude, orderBy: { createdAt: "desc" } });
const listFeatured = () => prisma.product.findMany({ where: { ...publicWhere, isFeatured: true }, include: defaultInclude, orderBy: { createdAt: "desc" } });
const listOffers = () => prisma.product.findMany({ where: { ...publicWhere, isOffer: true }, include: defaultInclude, orderBy: { createdAt: "desc" } });
const listNew = () => prisma.product.findMany({ where: { ...publicWhere, isNew: true }, include: defaultInclude, orderBy: { createdAt: "desc" } });

const getById = async (id: number) => {
  const product = await prisma.product.findFirst({ where: { id, ...publicWhere }, include: defaultInclude });
  if (!product) throw new ApiError(404, "Producto no encontrado");
  return product;
};

const getBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({ where: { slug, ...publicWhere }, include: defaultInclude });
  if (!product) throw new ApiError(404, "Producto no encontrado");
  return product;
};

const listBestSellers = async () => {
  const sales = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { status: { in: ["PAID", "CONFIRMED", "COMPLETED"] } }, product: publicWhere },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 20,
  });
  if (sales.length === 0) return [];
  const products = await prisma.product.findMany({ where: { id: { in: sales.map((sale) => sale.productId) }, ...publicWhere }, include: defaultInclude });
  const byId = new Map(products.map((product) => [product.id, product]));
  return sales.flatMap((sale) => {
    const product = byId.get(sale.productId);
    return product ? [{ ...product, soldQuantity: sale._sum.quantity ?? 0 }] : [];
  });
};

const listAdmin = (query: AdminProductsQuery = {}) => prisma.product.findMany({
  ...(query.q && { where: { OR: [{ name: { contains: query.q, mode: "insensitive" as const } }, { sku: { contains: query.q, mode: "insensitive" as const } }] } }),
  include: defaultInclude,
  orderBy: { createdAt: "desc" },
});

const getAdminById = async (id: number) => {
  const product = await prisma.product.findUnique({ where: { id }, include: defaultInclude });
  if (!product) throw new ApiError(404, "Producto no encontrado");
  return product;
};

const create = async (payload: CreateProductInput) => {
  await ensureCategory(payload.categoryId);
  const slug = slugify(payload.slug ?? payload.name);
  const sku = normalizeSku(payload.sku);
  await ensureUniqueSlug(slug);
  await ensureUniqueSku(sku);
  return prisma.product.create({
    data: {
      name: payload.name, slug, sku, description: payload.description ?? null,
      price: payload.price.toFixed(2), compareAtPrice: payload.compareAtPrice?.toFixed(2) ?? null,
      stock: payload.stock, isFeatured: payload.isFeatured ?? false, isOffer: payload.isOffer ?? false,
      isNew: payload.isNew ?? false, isActive: payload.isActive ?? true, categoryId: payload.categoryId,
      ...(payload.images && { images: { create: payload.images.map((image) => ({ url: image.url, alt: image.alt ?? null, isPrimary: image.isPrimary ?? false })) } }),
    },
    include: defaultInclude,
  });
};

const update = async (id: number, payload: UpdateProductInput) => {
  await getAdminById(id);
  if (payload.categoryId !== undefined) await ensureCategory(payload.categoryId);
  const slug = payload.slug !== undefined || payload.name !== undefined ? slugify(payload.slug ?? payload.name ?? "") : undefined;
  const sku = payload.sku !== undefined ? normalizeSku(payload.sku) : undefined;
  if (slug) await ensureUniqueSlug(slug, id);
  if (sku !== undefined) await ensureUniqueSku(sku, id);
  return prisma.$transaction(async (tx) => {
    if (payload.images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({ data: payload.images.map((image) => ({ productId: id, url: image.url, alt: image.alt ?? null, isPrimary: image.isPrimary ?? false })) });
    }
    return tx.product.update({
      where: { id },
      data: {
        ...(payload.name !== undefined && { name: payload.name }), ...(slug && { slug }), ...(sku !== undefined && { sku }),
        ...(payload.description !== undefined && { description: payload.description }),
        ...(payload.price !== undefined && { price: payload.price.toFixed(2) }),
        ...(payload.compareAtPrice !== undefined && { compareAtPrice: payload.compareAtPrice?.toFixed(2) ?? null }),
        ...(payload.stock !== undefined && { stock: payload.stock }), ...(payload.isFeatured !== undefined && { isFeatured: payload.isFeatured }),
        ...(payload.isOffer !== undefined && { isOffer: payload.isOffer }), ...(payload.isNew !== undefined && { isNew: payload.isNew }),
        ...(payload.isActive !== undefined && { isActive: payload.isActive }), ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
      },
      include: defaultInclude,
    });
  });
};

const deactivate = async (id: number) => {
  await getAdminById(id);
  return prisma.product.update({ where: { id }, data: { isActive: false }, include: defaultInclude });
};

const updateStock = async (id: number, payload: UpdateStockInput) => {
  await getAdminById(id);
  return prisma.product.update({ where: { id }, data: { stock: payload.stock }, include: defaultInclude });
};

const updatePrice = async (id: number, payload: UpdatePriceInput) => {
  await getAdminById(id);
  return prisma.product.update({ where: { id }, data: { price: payload.price.toFixed(2), ...(payload.compareAtPrice !== undefined && { compareAtPrice: payload.compareAtPrice?.toFixed(2) ?? null }), ...(payload.isOffer !== undefined && { isOffer: payload.isOffer }) }, include: defaultInclude });
};

export const productsService = { list, getById, getBySlug, listFeatured, listOffers, listNew, listBestSellers, listAdmin, getAdminById, create, update, deactivate, updateStock, updatePrice };
