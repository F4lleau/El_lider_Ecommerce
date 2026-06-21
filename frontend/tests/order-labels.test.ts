import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  deliveryMethodLabel,
  orderStatusLabel,
  orderStatusOptionsForDelivery,
  paymentMethodLabel,
  paymentStatusLabel,
} from "../src/utils/order-labels";

describe("order labels", () => {
  test("traduce metodos de pago y entrega", () => {
    assert.equal(paymentMethodLabel("CASH"), "Efectivo");
    assert.equal(paymentMethodLabel("MERCADOPAGO"), "Mercado Pago");
    assert.equal(deliveryMethodLabel("PICKUP"), "Retiro en sucursal");
    assert.equal(deliveryMethodLabel("SHIPPING"), "Envío a domicilio");
  });

  test("traduce estados de pedido y pago", () => {
    assert.equal(orderStatusLabel("PENDING_PAYMENT"), "Pendiente de pago");
    assert.equal(orderStatusLabel("CONFIRMED"), "Pedido confirmado");
    assert.equal(orderStatusLabel("READY_FOR_PICKUP"), "Listo para retirar");
    assert.equal(orderStatusLabel("DELIVERED", "PICKUP"), "Retirado");
    assert.equal(paymentStatusLabel("PENDING"), "Pago pendiente");
    assert.equal(paymentStatusLabel("APPROVED"), "Pago aprobado");
    assert.equal(paymentStatusLabel("IN_PROCESS"), "Pago en proceso");
  });

  test("limita opciones admin segun entrega", () => {
    assert.deepEqual(orderStatusOptionsForDelivery("PICKUP", "CONFIRMED"), ["CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "DELIVERED", "CANCELLED"]);
    assert.deepEqual(orderStatusOptionsForDelivery("SHIPPING", "CONFIRMED"), ["CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"]);
    assert.deepEqual(orderStatusOptionsForDelivery("PICKUP", "PENDING_PAYMENT"), ["PENDING_PAYMENT", "CANCELLED"]);
  });
});
