import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import type { AddressInput, UpdateAddressInput, UpdateMeInput } from "./users.schema.js";
import type { Prisma } from "@prisma/client";

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const normalizeOptional = (value: string | null) => {
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getMe = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user) {
    throw new ApiError(404, "Usuario no encontrado");
  }

  return user;
};

const updateMe = async (userId: number, payload: UpdateMeInput) => {
  await getMe(userId);
  const data: Prisma.UserUpdateInput = {};
  if (payload.firstName !== undefined) data.firstName = payload.firstName;
  if (payload.lastName !== undefined) data.lastName = payload.lastName;

  return prisma.user.update({
    where: { id: userId },
    data,
    select: userSelect,
  });
};

const listAddresses = (userId: number) =>
  prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

const createAddressData = (userId: number, payload: AddressInput, isDefault: boolean): Prisma.AddressUncheckedCreateInput => ({
  userId,
  recipient: payload.recipient,
  street: payload.street,
  number: payload.number,
  city: payload.city,
  postalCode: payload.postalCode,
  country: payload.country,
  isDefault,
  label: payload.label !== undefined ? normalizeOptional(payload.label) : null,
  phone: payload.phone !== undefined ? normalizeOptional(payload.phone) : null,
  apartment: payload.apartment !== undefined ? normalizeOptional(payload.apartment) : null,
  state: payload.state !== undefined ? normalizeOptional(payload.state) : null,
});

const updateAddressData = (payload: UpdateAddressInput): Prisma.AddressUncheckedUpdateInput => {
  const data: Prisma.AddressUncheckedUpdateInput = {};
  if (payload.label !== undefined) data.label = normalizeOptional(payload.label);
  if (payload.recipient !== undefined) data.recipient = payload.recipient;
  if (payload.phone !== undefined) data.phone = normalizeOptional(payload.phone);
  if (payload.street !== undefined) data.street = payload.street;
  if (payload.number !== undefined) data.number = payload.number;
  if (payload.apartment !== undefined) data.apartment = normalizeOptional(payload.apartment);
  if (payload.city !== undefined) data.city = payload.city;
  if (payload.state !== undefined) data.state = normalizeOptional(payload.state);
  if (payload.postalCode !== undefined) data.postalCode = payload.postalCode;
  if (payload.country !== undefined) data.country = payload.country;
  if (payload.isDefault !== undefined) data.isDefault = payload.isDefault;
  return data;
};

const createAddress = async (userId: number, payload: AddressInput) => {
  await getMe(userId);
  return prisma.$transaction(async (tx) => {
    const existingCount = await tx.address.count({ where: { userId } });
    const shouldBeDefault = payload.isDefault ?? existingCount === 0;
    if (shouldBeDefault) {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return tx.address.create({
      data: createAddressData(userId, payload, shouldBeDefault),
    });
  });
};

const getOwnedAddress = async (userId: number, id: number) => {
  const address = await prisma.address.findFirst({ where: { id, userId } });
  if (!address) throw new ApiError(404, "Direccion no encontrada");
  return address;
};

const updateAddress = async (userId: number, id: number, payload: UpdateAddressInput) => {
  await getOwnedAddress(userId, id);
  return prisma.$transaction(async (tx) => {
    if (payload.isDefault) {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return tx.address.update({
      where: { id },
      data: updateAddressData(payload),
    });
  });
};

const deleteAddress = async (userId: number, id: number) => {
  await getOwnedAddress(userId, id);
  return prisma.address.delete({ where: { id } });
};

const setDefaultAddress = async (userId: number, id: number) => {
  await getOwnedAddress(userId, id);
  return prisma.$transaction(async (tx) => {
    await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.address.update({ where: { id }, data: { isDefault: true } });
  });
};

export const usersService = {
  getMe,
  updateMe,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
