import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

import type { PrismaClient } from "@prisma/client";
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
    summary: {
      itemsCount,
      subtotal: Number(subtotal.toFixed(2)),
    },
  };
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
    throw new ApiError(404, "Producto no encontrado");
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
    throw new ApiError(400, "No hay stock suficiente para ese producto");
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
    throw new ApiError(400, "El producto ya no esta disponible");
  }

  if (quantity > item.product.stock) {
    throw new ApiError(400, "No hay stock suficiente para ese producto");
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

export const cartService = {
  getByUser,
  addItem,
  updateItem,
  removeItem,
  clear,
  getOrCreateCart,
};
