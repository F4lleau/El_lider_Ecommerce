import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { hashValue } from "../src/utils/hash.js";

const { ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL } = process.env;

if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("DATABASE_URL, ADMIN_EMAIL y ADMIN_PASSWORD son requeridos");
}

if (ADMIN_PASSWORD.length < 8) {
  throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

const passwordHash = await hashValue(ADMIN_PASSWORD);

await prisma.user.upsert({
  where: { email: ADMIN_EMAIL.toLowerCase() },
  update: { role: UserRole.ADMIN, passwordHash },
  create: {
    firstName: "Admin",
    lastName: "El Lider",
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: UserRole.ADMIN,
  },
});

await prisma.$disconnect();
console.log(`Admin inicial creado o actualizado: ${ADMIN_EMAIL.toLowerCase()}`);
