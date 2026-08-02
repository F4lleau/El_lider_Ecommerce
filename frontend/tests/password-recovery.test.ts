import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, test } from "node:test";

describe("password recovery frontend wiring", () => {
  test("login muestra enlace a recuperar clave", async () => {
    const loginPage = await readFile(new URL("../src/pages/LoginPage.tsx", import.meta.url), "utf8");
    assert.match(loginPage, /Olvidé mi contraseña/);
    assert.match(loginPage, /to="\/recuperar-clave"/);
  });

  test("router expone recuperar y resetear clave", async () => {
    const router = await readFile(new URL("../src/app/router.tsx", import.meta.url), "utf8");
    assert.match(router, /path: "recuperar-clave"/);
    assert.match(router, /path: "resetear-clave"/);
  });

  test("reset page valida politica basica de contrasena", async () => {
    const resetPage = await readFile(new URL("../src/pages/ResetPasswordPage.tsx", import.meta.url), "utf8");
    assert.match(resetPage, /al menos 6 caracteres/);
    assert.match(resetPage, /mayúscula/);
    assert.match(resetPage, /minúscula/);
    assert.match(resetPage, /carácter especial/);
    assert.match(resetPage, /Las contraseñas no coinciden/);
  });
});
