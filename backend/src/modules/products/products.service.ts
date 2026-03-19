import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

const defaultInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  images: {
    orderBy: { isPrimary: "desc" as const },
  },
};

const list = async () => {
  return prisma.product.findMany({
    where: { isActive: true },
    include: defaultInclude,
    orderBy: { createdAt: "desc" },
  });
};

const getById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: defaultInclude,
  });

  if (!product || !product.isActive) {
    throw new ApiError(404, "Producto no encontrado");
  }

  return product;
};

const listFeatured = async () => {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: defaultInclude,
    orderBy: { createdAt: "desc" },
  });
};

const listOffers = async () => {
  return prisma.product.findMany({
    where: { isActive: true, isOffer: true },
    include: defaultInclude,
    orderBy: { createdAt: "desc" },
  });
};

const listNew = async () => {
  return prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: defaultInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const productsService = {
  list,
  getById,
  listFeatured,
  listOffers,
  listNew,
};
