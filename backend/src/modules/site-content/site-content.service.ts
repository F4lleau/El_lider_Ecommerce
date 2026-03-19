import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

const getByKey = async (key: string) => {
  const content = await prisma.siteContent.findUnique({
    where: { key },
  });

  if (!content || !content.isPublished) {
    throw new ApiError(404, "Contenido no encontrado");
  }

  return content;
};

export const siteContentService = {
  getByKey,
};
