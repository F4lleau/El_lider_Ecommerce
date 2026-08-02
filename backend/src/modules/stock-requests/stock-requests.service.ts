import { StockRequestStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { emailService } from "../email/email.service.js";
import type { CreateStockRequestInput } from "./stock-requests.schema.js";

const include = {
  product: { select: { id: true, name: true, slug: true, stock: true, images: { where: { isPrimary: true }, take: 1 } } },
};

const create = async (productId: number, userId: number | undefined, payload: CreateStockRequestInput) => {
  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true, category: { isActive: true } }, select: { id: true, stock: true } });
  if (!product) throw new ApiError(404, "Producto no encontrado");
  if (product.stock > 0) throw new ApiError(409, "El producto ya tiene stock disponible");

  let name = payload.name;
  let email = payload.email;
  let phone = payload.phone;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true, email: true } });
    if (!user) throw new ApiError(404, "Usuario no encontrado");
    name = `${user.firstName} ${user.lastName}`;
    email = user.email;
    phone = payload.phone;
  } else if (!name || !email || !phone) {
    throw new ApiError(400, "Nombre, email y telefono son requeridos para invitados");
  }

  const duplicate = await prisma.stockRequest.findFirst({ where: { productId, email, status: StockRequestStatus.PENDING }, select: { id: true } });
  if (duplicate) throw new ApiError(409, "Ya existe una solicitud pendiente para este producto y email");

  return prisma.stockRequest.create({ data: { productId, userId: userId ?? null, name: name ?? null, email: email!, phone: phone ?? null }, include });
};

const listMine = (userId: number) => prisma.stockRequest.findMany({ where: { userId }, include, orderBy: { createdAt: "desc" } });
const listAdmin = () => prisma.stockRequest.findMany({ include: { ...include, user: { select: { id: true, firstName: true, lastName: true, email: true } } }, orderBy: [{ status: "asc" }, { createdAt: "desc" }] });

const cancelMine = async (userId: number, id: number) => {
  const existing = await prisma.stockRequest.findFirst({ where: { id, userId } });
  if (!existing) throw new ApiError(404, "Solicitud no encontrada");
  if (existing.status !== StockRequestStatus.PENDING) {
    throw new ApiError(409, "Solo se pueden cancelar solicitudes pendientes");
  }
  return prisma.stockRequest.update({ where: { id }, data: { status: StockRequestStatus.CANCELLED }, include });
};

const updateStatus = async (id: number, status: StockRequestStatus) => {
  const existing = await prisma.stockRequest.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!existing) throw new ApiError(404, "Solicitud no encontrada");
  const updated = await prisma.stockRequest.update({ where: { id }, data: { status, notifiedAt: status === StockRequestStatus.NOTIFIED ? new Date() : null }, include });
  if (existing.status !== status && (status === StockRequestStatus.CONTACTED || status === StockRequestStatus.NOTIFIED)) {
    await emailService.safeSend(
      "stock-request-notification",
      () => emailService.sendStockAvailableEmail(updated),
      { stockRequestId: updated.id, to: updated.email },
    );
  }
  return updated;
};

export const stockRequestsService = { create, listMine, cancelMine, listAdmin, updateStatus };
