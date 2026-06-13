import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { slugify } from "../../utils/slug.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.schema.js";

const productInclude = { images: { orderBy: { isPrimary: "desc" as const } }, category: { select: { id: true, name: true, slug: true } } };

const ensureUniqueSlug = async (slug: string, excludeId?: number) => {
  const existing = await prisma.category.findFirst({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) }, select: { id: true } });
  if (existing) throw new ApiError(409, "Ya existe una categoria con ese slug");
};

const list = () => prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

const listProductsById = async (id: number) => {
  const category = await prisma.category.findFirst({ where: { id, isActive: true }, include: { products: { where: { isActive: true }, include: productInclude, orderBy: { createdAt: "desc" } } } });
  if (!category) throw new ApiError(404, "Categoria no encontrada");
  return category;
};

const listProductsBySlug = async (slug: string) => {
  const category = await prisma.category.findFirst({ where: { slug, isActive: true }, include: { products: { where: { isActive: true }, include: productInclude, orderBy: { createdAt: "desc" } } } });
  if (!category) throw new ApiError(404, "Categoria no encontrada");
  return category;
};

const listAdmin = () => prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });

const getAdminById = async (id: number) => {
  const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
  if (!category) throw new ApiError(404, "Categoria no encontrada");
  return category;
};

const create = async (payload: CreateCategoryInput) => {
  const slug = slugify(payload.slug ?? payload.name);
  await ensureUniqueSlug(slug);
  return prisma.category.create({ data: { name: payload.name, slug, description: payload.description ?? null, isActive: payload.isActive ?? true } });
};

const update = async (id: number, payload: UpdateCategoryInput) => {
  await getAdminById(id);
  const slug = payload.slug !== undefined || payload.name !== undefined ? slugify(payload.slug ?? payload.name ?? "") : undefined;
  if (slug) await ensureUniqueSlug(slug, id);
  return prisma.category.update({ where: { id }, data: { ...(payload.name !== undefined && { name: payload.name }), ...(slug && { slug }), ...(payload.description !== undefined && { description: payload.description }), ...(payload.isActive !== undefined && { isActive: payload.isActive }) } });
};

const deactivate = async (id: number) => {
  await getAdminById(id);
  return prisma.category.update({ where: { id }, data: { isActive: false } });
};

export const categoriesService = { list, listProductsById, listProductsBySlug, listAdmin, getAdminById, create, update, deactivate };
