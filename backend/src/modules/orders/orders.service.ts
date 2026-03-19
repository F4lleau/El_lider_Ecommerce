import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { cartService } from "../cart/cart.service.js";
import type { CheckoutInput } from "./orders.schema.js";

const orderInclude = {
  address: true,
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
};

const listByUser = async (userId: number) => {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
};

const getById = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: orderInclude,
  });

  if (!order) {
    throw new ApiError(404, "Orden no encontrada");
  }

  return order;
};

const checkout = async (userId: number, payload: CheckoutInput) => {
  const order = await prisma.$transaction(async (tx) => {
    const cart = await cartService.getOrCreateCart(userId, tx);

    if (cart.items.length === 0) {
      throw new ApiError(400, "El carrito esta vacio");
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new ApiError(400, `El producto ${item.product.name} no esta disponible`);
      }

      if (item.quantity > item.product.stock) {
        throw new ApiError(400, `Stock insuficiente para ${item.product.name}`);
      }
    }

    if (payload.address.isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await tx.address.create({
      data: {
        userId,
        label: payload.address.label ?? null,
        recipient: payload.address.recipient,
        phone: payload.address.phone ?? null,
        street: payload.address.street,
        number: payload.address.number,
        apartment: payload.address.apartment ?? null,
        city: payload.address.city,
        state: payload.address.state ?? null,
        postalCode: payload.address.postalCode,
        country: payload.address.country,
        isDefault: payload.address.isDefault ?? false,
      },
    });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    const createdOrder = await tx.order.create({
      data: {
        userId,
        addressId: address.id,
        status: "PENDING",
        totalAmount: totalAmount.toFixed(2),
        paymentMethod: payload.paymentMethod ?? null,
        notes: payload.notes ?? null,
        items: {
          create: cart.items.map((item) => {
            const unitPrice = Number(item.product.price);
            const totalPrice = unitPrice * item.quantity;
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: unitPrice.toFixed(2),
              totalPrice: totalPrice.toFixed(2),
            };
          }),
        },
      },
      include: orderInclude,
    });

    for (const item of cart.items) {
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity },
          isActive: true,
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (stockUpdate.count === 0) {
        throw new ApiError(409, `No se pudo reservar stock para ${item.product.name}`);
      }
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  });

  return order;
};

export const ordersService = {
  listByUser,
  getById,
  checkout,
};
