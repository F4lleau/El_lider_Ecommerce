import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

const getMe = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "Usuario no encontrado");
  }

  return user;
};

export const usersService = {
  getMe,
};
