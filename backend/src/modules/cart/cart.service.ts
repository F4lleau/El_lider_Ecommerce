import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

import type { PrismaClient } from "@prisma/client";
import type { AddCartItemInput } from "./cart.schema.js";
type PrismaTx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;

const cartInclude = {
  items: {
    orderBy: { createdAt: "asc" as const },
    include: {
      product: {
        include: {
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
        },
      },
    },
  },
};

const mapCartResponse = (cart: {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    product: { price: unknown };
  }>;
}) => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const itemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      subtotal: Number((Number(item.product.price) * item.quantity).toFixed(2)),
    })),
    summary: {
      itemsCount,
      subtotal: Number(subtotal.toFixed(2)),
    },
  };
};

const validateProducts = async (items: AddCartItemInput[]) => {
  const quantities = new Map<number, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  const products = await prisma.product.findMany({
    where: { id: { in: [...quantities.keys()] } },
    include: cartInclude.items.include.product.include,
  });

  return [...quantities.entries()].map(([productId, quantity]) => {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product || !product.isActive) {
      throw new ApiError(404, `Producto ${productId} no encontrado o inactivo`);
    }
    if (quantity > product.stock) {
      throw new ApiError(409, `Stock insuficiente para ${product.name}`);
    }
    return { product, productId, quantity };
  });
};

const validateGuest = async (items: AddCartItemInput[]) => {
  const validatedItems = await validateProducts(items);
  return mapCartResponse({
    id: 0,
    userId: 0,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    items: validatedItems.map((item, index) => ({
      id: -(index + 1),
      productId: item.productId,
      quantity: item.quantity,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      product: item.product,
    })),
  });
};

const getOrCreateCart = async (userId: number, db: PrismaClient | PrismaTx = prisma) => {
  const existingCart = await db.cart.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: cartInclude,
  });

  if (existingCart) {
    return existingCart;
  }

  return db.cart.create({
    data: { userId },
    include: cartInclude,
  });
};

const getByUser = async (userId: number) => {
  const cart = await getOrCreateCart(userId);
  return mapCartResponse(cart);
};

const addItem = async (userId: number, productId: number, quantity: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      isActive: true,
      stock: true,
    },
  });

  if (!product || !product.isActive) {
    throw new ApiError(404, "Producto no encontrado o inactivo");
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });

  const nextQuantity = (existingItem?.quantity ?? 0) + quantity;
  if (nextQuantity > product.stock) {
    throw new ApiError(409, "No hay stock suficiente para ese producto");
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: nextQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return getByUser(userId);
};

const updateItem = async (userId: number, itemId: number, quantity: number) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: {
        select: { userId: true },
      },
      product: {
        select: {
          stock: true,
          isActive: true,
        },
      },
    },
  });

  if (!item || item.cart.userId !== userId) {
    throw new ApiError(404, "Item de carrito no encontrado");
  }

  if (!item.product.isActive) {
    throw new ApiError(409, "El producto ya no esta disponible");
  }

  if (quantity > item.product.stock) {
    throw new ApiError(409, "No hay stock suficiente para ese producto");
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getByUser(userId);
};

const removeItem = async (userId: number, itemId: number) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: {
        select: { userId: true },
      },
    },
  });

  if (!item || item.cart.userId !== userId) {
    throw new ApiError(404, "Item de carrito no encontrado");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getByUser(userId);
};

const clear = async (userId: number) => {
  const cart = await getOrCreateCart(userId);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return getByUser(userId);
};

const sync = async (userId: number, items: AddCartItemInput[]) => {
  const cart = await getOrCreateCart(userId);
  const existingItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    select: { productId: true, quantity: true },
  });
  const combined = [
    ...existingItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    ...items,
  ];
  const validatedItems = await validateProducts(combined);

  await prisma.$transaction(
    validatedItems.map((item) =>
      prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: item.productId } },
        update: { quantity: item.quantity },
        create: { cartId: cart.id, productId: item.productId, quantity: item.quantity },
      }),
    ),
  );

  return getByUser(userId);
};

export const cartService = {
  getByUser,
  addItem,
  updateItem,
  removeItem,
  clear,
  sync,
  validateGuest,
  getOrCreateCart,
};
