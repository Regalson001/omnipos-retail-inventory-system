
/* =========================================
   OMNIPOS — INVENTORY MANAGEMENT
   ========================================= */

import {
  getState,
  update
} from "./state.js";

import {
  uid,
  today
} from "./data.js";

/* ADD PRODUCT OR RESTOCK EXISTING SKU */

export function addProduct(data) {

  const state = getState();

  const existing = state.products.find(
    product =>
      product.sku.toLowerCase() ===
      data.sku.toLowerCase()
  );

  if (existing) {

    update(state => {

      const product = state.products.find(
        p => p.id === existing.id
      );

      product.stock += Number(data.stock);

      product.cost = Number(data.cost);

      product.price = Number(data.price);

      product.batch = data.batch;

      product.expiry = data.expiry;

    });

    return existing;

  }

  const product = {

    id: uid("prod"),

    ...data,

    stock: Number(data.stock),

    minStock: Number(data.minStock),

    cost: Number(data.cost),

    price: Number(data.price),

    barcode: data.barcode || data.sku,

    image: data.image || ""

  };

  update(state => {
    state.products.unshift(product);
  });

  return product;

}

/* STOCK STATUS */

export function stockStatus(product) {

  if (product.stock <= product.minStock) {
    return "Low stock";
  }

  return "In stock";

}

/* EXPIRY STATUS */

export function expiryStatus(product) {

  if (!product.expiry) {
    return "No expiry";
  }

  const days = (
    new Date(product.expiry) -
    new Date(today())
  ) / 86400000;

  if (days < 0) {
    return "Expired";
  }

  if (days <= 30) {
    return "Expiring soon";
  }

  return "Valid";

}

/* INVENTORY ALERTS */

export function stockWarnings() {

  return getState().products.filter(product => {

    return (
      product.stock <= product.minStock ||
      ["Expired", "Expiring soon"].includes(
        expiryStatus(product)
      )
    );

  });

}
