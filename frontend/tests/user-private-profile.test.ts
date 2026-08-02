import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, test } from "node:test";

describe("user private profile frontend wiring", () => {
  test("router protege y expone rutas de mi cuenta", async () => {
    const router = await readFile(new URL("../src/app/router.tsx", import.meta.url), "utf8");
    assert.match(router, /<ProtectedRoute \/>/);
    assert.match(router, /path: "mi-cuenta"/);
    assert.match(router, /path: "perfil"/);
    assert.match(router, /path: "direcciones"/);
    assert.match(router, /path: "pedidos"/);
    assert.match(router, /path: "pedidos\/:id"/);
    assert.match(router, /path: "solicitudes-stock"/);
  });

  test("layout muestra navegacion privada en espanol", async () => {
    const layout = await readFile(new URL("../src/components/account/AccountLayout.tsx", import.meta.url), "utf8");
    for (const label of ["Resumen", "Mis datos", "Mis direcciones", "Mis pedidos", "Solicitudes de stock", "Cerrar sesion"]) {
      assert.match(layout, new RegExp(label));
    }
  });

  test("pantallas principales muestran estados y labels requeridos", async () => {
    const dashboard = await readFile(new URL("../src/pages/AccountPage.tsx", import.meta.url), "utf8");
    const profile = await readFile(new URL("../src/pages/AccountProfilePage.tsx", import.meta.url), "utf8");
    const addresses = await readFile(new URL("../src/pages/AccountAddressesPage.tsx", import.meta.url), "utf8");
    const orders = await readFile(new URL("../src/pages/MyOrdersPage.tsx", import.meta.url), "utf8");
    const orderDetail = await readFile(new URL("../src/pages/MyOrderDetailPage.tsx", import.meta.url), "utf8");
    const stockRequests = await readFile(new URL("../src/pages/AccountStockRequestsPage.tsx", import.meta.url), "utf8");

    assert.match(dashboard, /Ultimos pedidos/);
    assert.match(profile, /Email/);
    assert.match(addresses, /Direccion principal/);
    assert.match(orders, /Numero de seguimiento/);
    assert.match(orderDetail, /Pagar con Mercado Pago/);
    assert.match(stockRequests, /Cancelar solicitud/);
  });

  test("helper de solicitudes evita enums crudos", async () => {
    const labels = await readFile(new URL("../src/utils/order-labels.ts", import.meta.url), "utf8");
    assert.match(labels, /stockRequestStatusLabel/);
    assert.match(labels, /PENDING: "Pendiente"/);
    assert.match(labels, /CANCELLED: "Cancelado"/);
  });
});
