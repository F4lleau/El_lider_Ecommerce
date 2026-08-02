import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerido"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET es requerido"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  DEFAULT_SHIPPING_COST: z.coerce.number().min(0).default(3000),
  PICKUP_ADDRESS: z.string().default("Av. Belgrano 103"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  BACKEND_URL: z.string().url().default("http://localhost:3000"),
  BACKEND_PUBLIC_URL: z.string().url().optional().or(z.literal("")),
  MERCADOPAGO_ACCESS_TOKEN: z.string().default(""),
  MERCADOPAGO_PUBLIC_KEY: z.string().default(""),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().default(""),
  EMAIL_ENABLED: z.coerce.boolean().default(false),
  EMAIL_PROVIDER: z.enum(["smtp"]).default("smtp"),
  EMAIL_FROM_NAME: z.string().default("El Lider"),
  EMAIL_FROM_ADDRESS: z.string().email().optional().or(z.literal("")).default(""),
  SMTP_HOST: z.string().optional().or(z.literal("")).default(""),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional().or(z.literal("")).default(""),
  SMTP_PASS: z.string().optional().or(z.literal("")).default(""),
  EMAIL_DEV_LOG: z.coerce.boolean().default(false),
});

export const env = envSchema.parse(process.env);
