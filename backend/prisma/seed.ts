import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { slugify } from "../src/utils/slug.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const categoriesData = [
  ["Reposteria", "Ingredientes, moldes y herramientas para reposteria."],
  ["Descartables", "Soluciones descartables para comercios y eventos."],
  ["Cotillon", "Articulos para fiestas, celebraciones y decoracion."],
  ["Envases", "Envases para conservar, presentar y entregar productos."],
  ["Gastronomia", "Utensilios e insumos para cocinas profesionales."],
] as const;

const productsData = [
  ["Harina 0000 1 kg", "Reposteria", 1450, 1750, 38, true, true, false],
  ["Chocolate cobertura semiamargo 500 g", "Reposteria", 6890, 7590, 16, true, true, true],
  ["Molde desmontable 24 cm", "Reposteria", 12500, null, 9, true, false, true],
  ["Manga pastelera reutilizable", "Reposteria", 3490, null, 25, false, false, true],
  ["Colorante alimentario rojo 30 ml", "Reposteria", 2290, null, 0, false, false, false],
  ["Vasos termicos 240 ml x 50", "Descartables", 5990, 6790, 42, true, true, false],
  ["Platos biodegradables x 25", "Descartables", 4290, null, 31, false, false, true],
  ["Cubiertos descartables reforzados x 50", "Descartables", 3890, null, 28, false, false, false],
  ["Servilletas blancas x 100", "Descartables", 2490, 2890, 54, false, true, false],
  ["Bandejas de carton doradas x 10", "Descartables", 7190, null, 12, true, false, true],
  ["Globos metalizados surtidos x 20", "Cotillon", 4990, 5790, 24, true, true, false],
  ["Guirnalda feliz cumpleanos", "Cotillon", 2590, null, 18, false, false, true],
  ["Velas numerales surtidas", "Cotillon", 1390, null, 45, false, false, false],
  ["Cortina metalizada dorada", "Cotillon", 3290, 3990, 0, true, true, true],
  ["Kit decoracion pastel", "Cotillon", 8490, null, 10, true, false, true],
  ["Pote plastico con tapa 500 ml x 25", "Envases", 7990, 8990, 36, true, true, false],
  ["Caja para torta 30 x 30 cm x 10", "Envases", 10990, null, 14, true, false, true],
  ["Frasco PET transparente 1 litro x 12", "Envases", 13490, null, 8, false, false, false],
  ["Bolsa kraft con manija x 25", "Envases", 9690, 10990, 20, false, true, true],
  ["Envase bisagra para porcion x 50", "Envases", 15490, null, 0, true, false, false],
  ["Espatula de silicona profesional", "Gastronomia", 4490, null, 17, true, false, true],
  ["Cuchillo chef acero inoxidable", "Gastronomia", 18990, 21990, 7, true, true, false],
  ["Tabla de corte gastronomica", "Gastronomia", 13990, null, 11, false, false, true],
  ["Pinza de acero 30 cm", "Gastronomia", 5390, null, 22, false, false, false],
  ["Balanza digital de cocina", "Gastronomia", 17990, 19990, 0, true, true, true],
] as const;

const skuPrefixes: Record<(typeof categoriesData)[number][0], string> = {
  Reposteria: "REP",
  Descartables: "DESC",
  Cotillon: "COT",
  Envases: "ENV",
  Gastronomia: "GAST",
};

async function main(): Promise<void> {
  const categories = new Map<string, number>();
  for (const [name, description] of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name, description, isActive: true },
      create: { name, slug: slugify(name), description, isActive: true },
    });
    categories.set(name, category.id);
  }

  const categorySkuCounters = new Map<string, number>();
  for (const [name, categoryName, price, compareAtPrice, stock, isFeatured, isOffer, isNew] of productsData) {
    const categoryId = categories.get(categoryName);
    if (!categoryId) throw new Error(`Categoria faltante: ${categoryName}`);
    const slug = slugify(name);
    const skuNumber = (categorySkuCounters.get(categoryName) ?? 0) + 1;
    categorySkuCounters.set(categoryName, skuNumber);
    const sku = `${skuPrefixes[categoryName]}-${String(skuNumber).padStart(3, "0")}`;
    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name, sku, description: `${name}, seleccionado para comercios, eventos y emprendimientos.`,
        price: price.toFixed(2), compareAtPrice: compareAtPrice?.toFixed(2) ?? null, stock,
        isFeatured, isOffer, isNew, isActive: true, categoryId,
      },
      create: {
        name, slug, sku, description: `${name}, seleccionado para comercios, eventos y emprendimientos.`,
        price: price.toFixed(2), compareAtPrice: compareAtPrice?.toFixed(2) ?? null, stock,
        isFeatured, isOffer, isNew, isActive: true, categoryId,
      },
    });
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80&sig=${product.id}`,
        alt: name,
        isPrimary: true,
      },
    });
  }

  await prisma.siteContent.upsert({
    where: { key: "home-hero" },
    update: { title: "Hero Home", content: "Todo para reposteria, eventos y gastronomia.", isPublished: true },
    create: { key: "home-hero", title: "Hero Home", content: "Todo para reposteria, eventos y gastronomia.", isPublished: true },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
