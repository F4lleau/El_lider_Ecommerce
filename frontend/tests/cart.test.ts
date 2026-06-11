import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { addGuestItem, guestItemsCount, removeGuestItem, updateGuestItem } from "../src/features/cart/guest-cart.js";

describe("guest cart operations", () => {
  test("agrega e incrementa sin duplicar", () => {
    const first = addGuestItem([], 10, 5);
    const second = addGuestItem(first, 10, 5);
    assert.deepEqual(second, [{ productId: 10, quantity: 2 }]);
  });

  test("rechaza producto sin stock o cantidad superior al stock", () => {
    assert.throws(() => addGuestItem([], 10, 0));
    assert.throws(() => addGuestItem([{ productId: 10, quantity: 2 }], 10, 2));
  });

  test("actualiza, resta y elimina items", () => {
    const items = [{ productId: 10, quantity: 2 }, { productId: 20, quantity: 1 }];
    assert.deepEqual(updateGuestItem(items, 10, 1), [{ productId: 10, quantity: 1 }, { productId: 20, quantity: 1 }]);
    assert.deepEqual(updateGuestItem(items, 10, 0), [{ productId: 20, quantity: 1 }]);
    assert.deepEqual(removeGuestItem(items, 20), [{ productId: 10, quantity: 2 }]);
  });

  test("calcula contador y permite vaciar", () => {
    const items = [{ productId: 10, quantity: 2 }, { productId: 20, quantity: 3 }];
    assert.equal(guestItemsCount(items), 5);
    assert.deepEqual(items.filter(() => false), []);
  });
});
