import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { slugify } from "../src/utils/slug.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main(): Promise<void> {
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteContent.deleteMany();

  const categoriesData = [
    {
      name: "Tortas",
      description: "Tortas artesanales para celebraciones y eventos.",
    },
    {
      name: "Postres Individuales",
      description: "Opciones listas para servir en porciones individuales.",
    },
    {
      name: "Panaderia Dulce",
      description: "Facturas, medialunas y panificados dulces frescos.",
    },
  ];

  const categories = await Promise.all(
    categoriesData.map((category) =>
      prisma.category.create({
        data: {
          name: category.name,
          slug: slugify(category.name),
          description: category.description,
          isActive: true,
        },
      }),
    ),
  );

  const tortas = categories.find((item) => item.slug === "tortas");
  const postres = categories.find((item) => item.slug === "postres-individuales");
  const panaderia = categories.find((item) => item.slug === "panaderia-dulce");

  if (!tortas || !postres || !panaderia) {
    throw new Error("No se pudieron crear las categorias base para el seed");
  }

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Torta Red Velvet",
        slug: "torta-red-velvet",
        description: "Bizcocho humedo de cacao, relleno y cobertura de queso crema.",
        price: "28990.00",
        compareAtPrice: "32990.00",
        stock: 12,
        isFeatured: true,
        isOffer: true,
        isNew: false,
        isActive: true,
        categoryId: tortas.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Cheesecake Frutos Rojos",
        slug: "cheesecake-frutos-rojos",
        description: "Base crocante con crema de queso y coulis de frutos rojos.",
        price: "21990.00",
        compareAtPrice: null,
        stock: 20,
        isFeatured: true,
        isOffer: false,
        isNew: true,
        isActive: true,
        categoryId: postres.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Caja de Medialunas Manteca",
        slug: "caja-medialunas-manteca",
        description: "Docena de medialunas de manteca recien horneadas.",
        price: "8990.00",
        compareAtPrice: "9990.00",
        stock: 40,
        isFeatured: false,
        isOffer: true,
        isNew: true,
        isActive: true,
        categoryId: panaderia.id,
      },
    }),
  ]);

  await prisma.productImage.createMany({
    data: [
      {
        productId: products[0].id,
        url: "https://images.unsplash.com/photo-1559622214-f8a9850965bb",
        alt: "Torta red velvet",
        isPrimary: true,
      },
      {
        productId: products[1].id,
        url: "https://images.unsplash.com/photo-1690980559928-c72f5bb66911",
        alt: "Cheesecake de frutos rojos",
        isPrimary: true,
      },
      {
        productId: products[2].id,
        url: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
        alt: "Caja de medialunas",
        isPrimary: true,
      },
    ],
  });

  await prisma.siteContent.createMany({
    data: [
      {
        key: "home-hero",
        title: "Hero Home",
        content:
          "Pasteleria artesanal hecha en el dia con ingredientes seleccionados.",
        isPublished: true,
      },
      {
        key: "shipping-info",
        title: "Informacion de Envios",
        content: "Enviamos en el dia en CABA y GBA para pedidos antes de las 14:00.",
        isPublished: true,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
