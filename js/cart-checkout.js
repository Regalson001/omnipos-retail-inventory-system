
/* =========================================
   OMNIPOS — CART & CHECKOUT ENGINE
   ========================================= */

import {
  getState,
  update
} from "./state.js";

import {
  uid,
  dateTime,
  SHOP
} from "./data.js";

/* ADD PRODUCT TO CART */

export function addToCart(productId) {

  const product = getState().products.find(
    p => p.id === productId
  );

  if (!product || product.stock <= 0) {

    throw Error("This product is out of stock.");

  }

  update(state => {

    const line = state.cart.find(
      item => item.id === productId
    );

    if (line) {

      if (line.qty >= product.stock) {
        throw Error("Not enough stock available.");
      }

      line.qty++;

    } else {

      state.cart.push({

        id: product.id,

        name: product.name,

        sku: product.sku,

        qty: 1,

        price: product.price,

        cost: product.cost

      });

    }

  });

}

/* UPDATE QUANTITY */

export function changeQty(id, delta) {

  const product = getState().products.find(
    p => p.id === id
  );

  update(state => {

    const line = state.cart.find(
      item => item.id === id
    );

    if (!line) return;

    line.qty = Math.min(
      product.stock,
      line.qty + delta
    );

    if (line.qty <= 0) {

      state.cart = state.cart.filter(
        item => item.id !== id
      );

    }

  });

}

/* CLEAR CART */

export function clearCart() {

  update(state => {

    state.cart = [];

    state.discount = 0;

  });

}

/* DISCOUNT */

export function setDiscount(value) {

  update(
    state => {
      state.discount = Math.max(
        0,
        Number(value) || 0
      );
    },
    { queue: false }
  );

}

/* CART TOTALS */

export function totals() {

  const state = getState();

  const subtotal = state.cart.reduce(
    (total, item) =>
      total + item.price * item.qty,
    0
  );

  const discount = Math.min(
    subtotal,
    state.discount
  );

  const gross = Math.max(
    0,
    subtotal - discount
  );

  const tax =
    gross * SHOP.vat / (1 + SHOP.vat);

  return {

    subtotal,

    discount,

    tax,

    total: gross

  };

}

/* COMPLETE SALE */

export function checkout(
  method,
  customerId = ""
) {

  const state = getState();

  const cart = state.cart.map(
    item => ({ ...item })
  );

  const calculated = totals();

  if (!cart.length) {

    throw Error(
      "Add at least one product to the basket."
    );

  }

  const sale = {

    id: uid("sale"),

    receipt: uid("RCPT").toUpperCase(),

    timestamp: dateTime(),

    customerId,

    customer:
      state.customers.find(
        c => c.id === customerId
      )?.name || "Walk-in customer",

    items: cart,

    total: calculated.total,

    discount: calculated.discount,

    tax: calculated.tax,

    method,

    cogs: cart.reduce(
      (total, item) =>
        total + item.cost * item.qty,
      0
    )

  };

  update(state => {

    cart.forEach(item => {

      const product = state.products.find(
        p => p.id === item.id
      );

      if (
        !product ||
        product.stock < item.qty
      ) {

        throw Error(
          `Insufficient stock for ${item.name}`
        );

      }

      product.stock -= item.qty;

    });

    state.sales.unshift(sale);

    state.cart = [];

    state.discount = 0;

  });

  return sale;

}

/* PRINT RECEIPT */

export function printReceipt(sale) {

  const element = document.getElementById(
    "receiptPrint"
  );

  const rows = sale.items.map(item => {

    return `
      <tr>
        <td>${item.name} ×${item.qty}</td>
        <td class="right">
          ${(item.price * item.qty).toLocaleString("en-KE")}
        </td>
      </tr>
    `;

  }).join("");

  element.innerHTML = `

    <h2>${SHOP.name}</h2>

    <p>${SHOP.location}</p>

    <p>RETAIL SALES RECEIPT</p>

    <hr>

    <p style="text-align:left">

      Receipt: ${sale.receipt}<br>

      Date: ${sale.timestamp}<br>

      Served by: ${getState().cashier}<br>

      Customer: ${sale.customer}

    </p>

    <hr>

    <table>
      ${rows}
    </table>

    <hr>

    <table>

      <tr>
        <td>Payment</td>
        <td class="right">${sale.method}</td>
      </tr>

      <tr>
        <td>Discount</td>
        <td class="right">
          ${(sale.discount || 0).toLocaleString("en-KE")}
        </td>
      </tr>

      <tr>
        <td class="grand">TOTAL</td>
        <td class="right grand">
          KSh ${sale.total.toLocaleString("en-KE")}
        </td>
      </tr>

    </table>

    <hr>

    <p>Thank you for shopping with us!</p>

    <p>Goods once sold are subject to store policy.</p>

  `;

  window.print();

}
