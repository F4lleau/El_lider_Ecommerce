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
    product: { price: unknown; name: string; slug: string; sku: string | null; stock?: number };
  }>;
}, options: { restoreReservedStock?: boolean } = {}) => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const itemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      product: options.restoreReservedStock && item.product.stock !== undefined
        ? { ...item.product, stock: item.product.stock + item.quantity }
        : item.product,
      subtotal: Number((Number(item.product.price) * item.quantity).toFixed(2)),
    })),
    summary: {
      itemsCount,
      subtotal: Number(subtotal.toFixed(2)),
    },
  };
};

const reserveStock = async (db: PrismaClient | PrismaTx, productId: number, quantity: number) => {
  const updated = await db.product.updateMany({
    where: { id: productId, isActive: true, stock: { gte: quantity } },
    data: { stock: { decrement: quantity } },
  });
  if (updated.count !== 1) {
    throw new ApiError(409, "No hay stock suficiente para ese producto");
  }
};

const releaseStock = async (db: PrismaClient | PrismaTx, productId: number, quantity: number) => {
  await db.product.update({
    where: { id: productId },
    data: { stock: { increment: quantity } },
  });
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
  return mapCartResponse(cart, { restoreReservedStock: true });
};

const addItem = async (userId: number, productId: number, quantity: number) => {
  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId }, select: { id: true, isActive: true } });
    if (!product || !product.isActive) {
      throw new ApiError(404, "Producto no encontrado o inactivo");
    }

    const cart = await getOrCreateCart(userId, tx);
    const existingItem = await tx.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
      select: { id: true, quantity: true },
    });

    await reserveStock(tx, productId, quantity);

    if (existingItem) {
      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await tx.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
    }
  });

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

  await prisma.$transaction(async (tx) => {
    const delta = quantity - item.quantity;
    if (delta > 0) await reserveStock(tx, item.productId, delta);
    if (delta < 0) await releaseStock(tx, item.productId, Math.abs(delta));
    await tx.cartItem.update({ where: { id: itemId }, data: { quantity } });
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

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.delete({ where: { id: itemId } });
    await releaseStock(tx, item.productId, item.quantity);
  });

  return getByUser(userId);
};

const clear = async (userId: number) => {
  const cart = await getOrCreateCart(userId);
  const items = await prisma.cartItem.findMany({ where: { cartId: cart.id }, select: { productId: true, quantity: true } });

  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      await releaseStock(tx, item.productId, item.quantity);
    }
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
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
  const quantities = new Map<number, number>();
  for (const item of combined) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  const existingByProduct = new Map(existingItems.map((item) => [item.productId, item.quantity]));

  await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: [...quantities.keys()] } },
      select: { id: true, name: true, isActive: true, stock: true },
    });

    for (const [productId, nextQuantity] of quantities) {
      const product = products.find((candidate) => candidate.id === productId);
      if (!product || !product.isActive) throw new ApiError(404, `Producto ${productId} no encontrado o inactivo`);
      const delta = nextQuantity - (existingByProduct.get(productId) ?? 0);
      if (delta > product.stock) throw new ApiError(409, `Stock insuficiente para ${product.name}`);
      if (delta > 0) await reserveStock(tx, productId, delta);
      if (delta < 0) await releaseStock(tx, productId, Math.abs(delta));
      await tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        update: { quantity: nextQuantity },
        create: { cartId: cart.id, productId, quantity: nextQuantity },
      });
    }
  });

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
