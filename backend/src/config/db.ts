import { prisma } from "../lib/prisma.js";

export const connectDB = async (): Promise<void> => {
  await prisma.$connect();
  console.log("✅ Base de datos conectada");
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};
