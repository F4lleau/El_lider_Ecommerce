import nodemailer, { type Transporter } from "nodemailer";
import { DeliveryMethod, PaymentMethod, type Order, type Product, type StockRequest, type User } from "@prisma/client";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type EmailResult = { skipped: boolean; messageId?: string };
type EmailSender = (payload: EmailPayload) => Promise<EmailResult>;

type CustomerOrder = Pick<
  Order,
  "id" | "orderNumber" | "trackingCode" | "guestEmail" | "deliveryMethod" | "paymentMethod" | "total"
> & {
  user?: Pick<User, "email"> | null;
};

type StockRequestWithProduct = Pick<StockRequest, "id" | "email"> & {
  product: Pick<Product, "name" | "slug">;
};

let transporter: Transporter | null = null;
let senderOverride: EmailSender | null = null;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const paragraphHtml = (lines: string[]) => lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");

const linkHtml = (label: string, url: string) =>
  `<p><a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a></p>`;

const formatMoney = (value: unknown) =>
  Number(value).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const deliveryMethodLabel = (method: DeliveryMethod) =>
  method === DeliveryMethod.PICKUP ? "Retiro en sucursal" : "Envio a domicilio";

const paymentMethodLabel = (method: PaymentMethod) =>
  method === PaymentMethod.CASH ? "Efectivo" : "Mercado Pago";

const frontendUrl = () => env.FRONTEND_URL.replace(/\/$/, "");

const trackingUrl = (trackingCode: string) => `${frontendUrl()}/pedido/${encodeURIComponent(trackingCode)}`;

const productUrl = (slug: string | null | undefined) => (slug ? `${frontendUrl()}/productos/${encodeURIComponent(slug)}` : null);

const customerEmail = (order: CustomerOrder) => order.guestEmail ?? order.user?.email ?? "";

const requireSmtpConfig = () => {
  if (!env.EMAIL_FROM_ADDRESS || !env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new ApiError(503, "Email SMTP no esta configurado correctamente");
  }
};

const getTransporter = () => {
  requireSmtpConfig();
  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
  return transporter;
};

const fromAddress = () => {
  const safeName = env.EMAIL_FROM_NAME.replace(/"/g, "'");
  return `"${safeName}" <${env.EMAIL_FROM_ADDRESS}>`;
};

const logEmail = (event: "sent" | "skipped", payload: Pick<EmailPayload, "to" | "subject">, messageId?: string) => {
  if (!env.EMAIL_DEV_LOG && event === "skipped") return;
  console.info("Email notification", {
    event,
    to: payload.to,
    subject: payload.subject,
    ...(messageId ? { messageId } : {}),
  });
};

const realSendEmail: EmailSender = async (payload) => {
  if (!env.EMAIL_ENABLED) {
    logEmail("skipped", payload);
    return { skipped: true };
  }
  const response = await getTransporter().sendMail({
    from: fromAddress(),
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
  logEmail("sent", payload, response.messageId);
  return { skipped: false, messageId: response.messageId };
};

const sendEmail = (payload: EmailPayload) => {
  if (!env.EMAIL_ENABLED) {
    logEmail("skipped", payload);
    return Promise.resolve({ skipped: true });
  }
  return (senderOverride ?? realSendEmail)(payload);
};

const sendPasswordResetEmail = (input: { to: string; resetUrl: string; expiresInMinutes: number }) => {
  const lines = [
    "Recibimos una solicitud para recuperar tu contrasena.",
    "Hace clic en el siguiente enlace para crear una nueva contrasena.",
    `Este enlace vence en ${input.expiresInMinutes} minutos.`,
    "Si no solicitaste este cambio, podes ignorar este mensaje.",
    input.resetUrl,
  ];
  return sendEmail({
    to: input.to,
    subject: "Recuperacion de contrasena - El Lider",
    text: lines.join("\n"),
    html: `${paragraphHtml(lines.slice(0, 4))}${linkHtml("Crear nueva contrasena", input.resetUrl)}`,
  });
};

const orderMessage = (order: CustomerOrder) => {
  if (order.paymentMethod === PaymentMethod.CASH && order.deliveryMethod === DeliveryMethod.PICKUP) {
    return "Tu pedido fue registrado para retirar en sucursal y pagar en efectivo al retirar.";
  }
  if (order.paymentMethod === PaymentMethod.CASH && order.deliveryMethod === DeliveryMethod.SHIPPING) {
    return "Tu pedido fue registrado para envio a domicilio y pago en efectivo al recibir.";
  }
  return "Tu pedido fue creado y esta pendiente de pago con Mercado Pago.";
};

const sendOrderConfirmedEmail = (order: CustomerOrder) => {
  const to = customerEmail(order);
  if (!to) return Promise.resolve({ skipped: true });
  const url = trackingUrl(order.trackingCode);
  const lines = [
    orderMessage(order),
    `Numero de orden: ${order.orderNumber}`,
    `Numero de seguimiento: ${order.trackingCode}`,
    `Metodo de entrega: ${deliveryMethodLabel(order.deliveryMethod)}`,
    `Metodo de pago: ${paymentMethodLabel(order.paymentMethod)}`,
    `Total: ${formatMoney(order.total)}`,
    `Seguimiento: ${url}`,
  ];
  return sendEmail({
    to,
    subject: "Pedido confirmado - El Lider",
    text: lines.join("\n"),
    html: `${paragraphHtml(lines.slice(0, 6))}${linkHtml("Ver seguimiento", url)}`,
  });
};

const sendPaymentApprovedEmail = (order: CustomerOrder) => {
  const to = customerEmail(order);
  if (!to) return Promise.resolve({ skipped: true });
  const url = trackingUrl(order.trackingCode);
  const lines = [
    "Tu pago fue aprobado correctamente.",
    `Numero de orden: ${order.orderNumber}`,
    `Numero de seguimiento: ${order.trackingCode}`,
    `Total pagado: ${formatMoney(order.total)}`,
    `Seguimiento: ${url}`,
  ];
  return sendEmail({
    to,
    subject: "Pago aprobado - El Lider",
    text: lines.join("\n"),
    html: `${paragraphHtml(lines.slice(0, 4))}${linkHtml("Ver seguimiento", url)}`,
  });
};

const sendOrderReadyForPickupEmail = (order: CustomerOrder) => {
  const to = customerEmail(order);
  if (!to) return Promise.resolve({ skipped: true });
  const url = trackingUrl(order.trackingCode);
  const lines = [
    "Tu pedido ya esta listo para retirar en sucursal.",
    `Numero de orden: ${order.orderNumber}`,
    `Numero de seguimiento: ${order.trackingCode}`,
    `Seguimiento: ${url}`,
  ];
  return sendEmail({
    to,
    subject: "Tu pedido esta listo para retirar - El Lider",
    text: lines.join("\n"),
    html: `${paragraphHtml(lines.slice(0, 3))}${linkHtml("Ver seguimiento", url)}`,
  });
};

const sendOrderShippedEmail = (order: CustomerOrder) => {
  const to = customerEmail(order);
  if (!to) return Promise.resolve({ skipped: true });
  const url = trackingUrl(order.trackingCode);
  const lines = [
    "Tu pedido esta en camino.",
    `Numero de orden: ${order.orderNumber}`,
    `Numero de seguimiento: ${order.trackingCode}`,
    `Seguimiento: ${url}`,
  ];
  return sendEmail({
    to,
    subject: "Tu pedido esta en camino - El Lider",
    text: lines.join("\n"),
    html: `${paragraphHtml(lines.slice(0, 3))}${linkHtml("Ver seguimiento", url)}`,
  });
};

const sendStockAvailableEmail = (request: StockRequestWithProduct) => {
  if (!request.email) return Promise.resolve({ skipped: true });
  const url = productUrl(request.product.slug);
  const lines = [
    `El producto ${request.product.name} ya puede volver a consultarse.`,
    ...(url ? [`Producto: ${url}`] : []),
  ];
  return sendEmail({
    to: request.email,
    subject: "Producto nuevamente disponible - El Lider",
    text: lines.join("\n"),
    html: `${paragraphHtml([`El producto ${request.product.name} ya puede volver a consultarse.`])}${url ? linkHtml("Ver producto", url) : ""}`,
  });
};

const logEmailError = (context: string, error: unknown, metadata: Record<string, unknown> = {}) => {
  console.error("Email notification error", {
    context,
    message: error instanceof Error ? error.message : "unknown",
    ...metadata,
  });
};

const safeSend = async (context: string, operation: () => Promise<EmailResult>, metadata: Record<string, unknown> = {}) => {
  try {
    await operation();
  } catch (error) {
    logEmailError(context, error, metadata);
  }
};

export const setEmailSenderForTests = (replacement: EmailSender) => {
  senderOverride = replacement;
};

export const resetEmailSenderForTests = () => {
  senderOverride = null;
  transporter = null;
};

export const emailService = {
  sendEmail,
  sendPasswordResetEmail,
  sendOrderConfirmedEmail,
  sendPaymentApprovedEmail,
  sendOrderReadyForPickupEmail,
  sendOrderShippedEmail,
  sendStockAvailableEmail,
  safeSend,
};
