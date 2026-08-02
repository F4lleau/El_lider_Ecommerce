export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserAddress = {
  id: number;
  userId: number;
  label: string | null;
  recipient: string;
  phone: string | null;
  street: string;
  number: string;
  apartment: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
};

export type UserAddressPayload = {
  label?: string | null;
  recipient: string;
  phone?: string | null;
  street: string;
  number: string;
  apartment?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
};
