import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

const list = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const listProductsBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            orderBy: { isPrimary: "desc" },
          },
        },
      },
    },
  });

  if (!category) {
    throw new ApiError(404, "Categoria no encontrada");
  }

  return category;
};

export const categoriesService = {
  list,
  listProductsBySlug,
};
