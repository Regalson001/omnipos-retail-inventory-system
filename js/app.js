
/* =========================================
   OMNIPOS — MAIN APPLICATION CONTROLLER
   ========================================= */

import {
  getState,
  subscribe,
  update,
  setOnline,
  flushQueue
} from "./state.js";

import {
  money,
  SHOP,
  fallbackImage
} from "./data.js";

import {
  initMpesaFeed,
  simulateIncoming
} from "./mpesa-feed.js";

import {
  addProduct,
  stockStatus,
  expiryStatus,
  stockWarnings
} from "./inventory.js";

import {
  addToCart,
  changeQty,
  clearCart,
  setDiscount,
  totals,
  checkout,
  printReceipt
} from "./cart-checkout.js";

import {
  registerCustomer,
  makeDebtSale,
  repayDebt
} from "./debt-sms.js";

import {
  metrics,
  drawChart,
  exportSalesCsv
} from "./analytics.js";

/* DOM HELPERS */

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];

let category = "All";

/* TOAST NOTIFICATIONS */

function toast(message, type = "success") {

  const element = document.createElement("div");

  element.className = `toast ${type}`;

  element.textContent = message;

  $("#toastStack").append(element);

  setTimeout(() => {
    element.remove();
  }, 3600);

}

/* MODAL CONTROLLER */

function showModal(
  title,
  subtitle,
  html,
  submitText,
  handler
) {

  $("#modalTitle").textContent = title;

  $("#modalSubtitle").textContent = subtitle || "";

  $("#modalBody").innerHTML = html;

  if (submitText) {

    const form = $("#modalBody form");

    form?.addEventListener("submit", event => {

      event.preventDefault();

      try {

        handler(new FormData(form));

      } catch (error) {

        toast(error.message, "error");

      }

    });

  }

  $("#modalBackdrop").classList.add("open");

}

function closeModal() {

  $("#modalBackdrop").classList.remove("open");

}

/* NAVIGATION */

function switchView(name) {

  $$(".view").forEach(view => {

    view.classList.toggle(
      "active",
      view.id === `view-${name}`
    );

  });

  $$(".nav-item[data-view]").forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.view === name
    );

  });

  const titles = {

    overview: "Good afternoon, Store Admin",

    checkout: "Point of sale",

    payments: "Incoming M-Pesa payments",

    inventory: "Inventory management",

    customers: "Customer credit ledger",

    analytics: "Business analytics"

  };

  $("#pageTitle").innerHTML =
    (titles[name] || name) + " <span>✦</span>";

  $("#sidebar").classList.remove("open");

  if (
    name === "overview" ||
    name === "analytics"
  ) {

    requestAnimationFrame(() => {
      drawChart($("#salesChart"));
    });

  }

}

/* DASHBOARD METRICS */

function renderKpis() {

  const data = metrics();

  $("#kpiRevenue").textContent =
    money(data.revenue);

  $("#kpiCogs").textContent =
    money(data.cogs);

  $("#kpiProfit").textContent =
    money(data.profit);

  $("#kpiDebt").textContent =
    money(data.debt);

  $("#kpiTransactions").textContent =
    data.transactions;

  $("#aRevenue").textContent =
    money(data.revenue);

  $("#aCogs").textContent =
    money(data.cogs);

  $("#aMargin").textContent =
    `${data.margin.toFixed(1)}%`;

  $("#aAverage").textContent =
    money(data.average);

  $("#mixTotal").innerHTML =
    `${money(data.revenue)} <small>total recorded</small>`;

  /* PAYMENT MIX */

  const methods = [
    "Cash",
    "M-Pesa",
    "Card",
    "Credit"
  ];

  const total = data.revenue || 1;

  $("#paymentMix").innerHTML = methods.map(method => {

    const amount = getState().sales
      .filter(sale => sale.method === method)
      .reduce(
        (sum, sale) => sum + sale.total,
        0
      );

    return `
      <div class="mix-row">

        <span>${method}</span>

        <div class="mix-track">
          <i style="width:${amount / total * 100}%"></i>
        </div>

        <b>${money(amount)}</b>

      </div>
    `;

  }).join("");

  /* RECENT SALES */

  $("#recentSales").innerHTML =
    getState().sales.slice(0, 4).map(sale => {

      return `
        <div class="compact-row">

          <span>
            <b>${sale.customer}</b>
            <small>${sale.receipt} · ${sale.method}</small>
          </span>

          <b>${money(sale.total)}</b>

        </div>
      `;

    }).join("") ||
    '<div class="empty-state">No transactions recorded yet.</div>';

  /* SALES LEDGER */

  $("#salesRows").innerHTML =
    getState().sales.map(sale => {

      return `
        <tr>

          <td class="payment-code">
            ${sale.receipt}
          </td>

          <td>${sale.timestamp}</td>

          <td>${sale.customer}</td>

          <td>${sale.items?.length || 0} lines</td>

          <td>
            <span class="pill-method">
              ${sale.method}
            </span>
          </td>

          <td><b>${money(sale.total)}</b></td>

        </tr>
      `;

    }).join("") ||
    '<tr><td colspan="6" class="muted-cell">No sales yet.</td></tr>';

  drawChart($("#salesChart"));

}

/* PRODUCT CATALOGUE */

function renderProducts() {

  const state = getState();

  const query = (
    $("#productSearch")?.value || ""
  ).toLowerCase();

  const products = state.products.filter(product => {

    return (
      (category === "All" ||
        product.category === category) &&

      `${product.name} ${product.sku} ${product.barcode}`
        .toLowerCase()
        .includes(query)
    );

  });

  const categories = [
    "All",
    ...new Set(
      state.products.map(p => p.category)
    )
  ];

  $("#categoryFilters").innerHTML =
    categories.map(name => {

      return `
        <button
          class="category-chip ${category === name ? "active" : ""}"
          data-category="${name}"
        >
          ${name}
        </button>
      `;

    }).join("");

  $("#productGrid").innerHTML =
    products.map(product => {

      return `
        <article
          class="product-tile"
          data-product="${product.id}"
        >

          <img
            src="${product.image || fallbackImage(product.name)}"
            alt="${product.name}"
            onerror="this.onerror=null;this.src='${fallbackImage(product.name)}'"
          >

          <div class="tile-info">

            <b>${product.name}</b>

            <small>
              ${product.sku} · ${product.stock} in stock
            </small>

            <strong>${money(product.price)}</strong>

          </div>

        </article>
      `;

    }).join("") ||
    '<div class="empty-state">No matching products.</div>';

  $("#categoryFilters")
    .querySelectorAll("button")
    .forEach(button => {

      button.onclick = () => {

        category = button.dataset.category;

        renderProducts();

      };

    });

}

/* CART RENDERING */

function renderCart() {

  const state = getState();

  const calculated = totals();

  $("#cartMeta").textContent =
    `${state.cart.reduce((sum, item) => sum + item.qty, 0)} items in basket`;

  $("#cartLines").innerHTML =
    state.cart.map(item => {

      return `
        <div class="cart-line">

          <div>

            <b>${item.name}</b>

            <small>${money(item.price)} each</small>

            <div class="qty-controls">

              <button
                data-qty="${item.id}"
                data-delta="-1"
              >−</button>

              <span>${item.qty}</span>

              <button
                data-qty="${item.id}"
                data-delta="1"
              >＋</button>

            </div>

          </div>

          <div class="cart-line-price">

            <b>${money(item.price * item.qty)}</b>

            <br>

            <button
              class="action-link danger"
              data-remove="${item.id}"
            >
              Remove
            </button>

          </div>

        </div>
      `;

    }).join("") ||
    `
      <div class="empty-state">
        Your basket is empty.
        <br>
        <small>Select a product to get started.</small>
      </div>
    `;

  $("#discountInput").value = state.discount;

  $("#cartSubtotal").textContent =
    money(calculated.subtotal);

  $("#cartTax").textContent =
    money(calculated.tax);

  $("#cartTotal").textContent =
    money(calculated.total);

}

/* INVENTORY RENDERING */

function renderInventory() {

  const state = getState();

  const query = (
    $("#inventorySearch")?.value || ""
  ).toLowerCase();

  const products = state.products.filter(product => {

    return `${product.name} ${product.sku}`
      .toLowerCase()
      .includes(query);

  });

  $("#inventoryRows").innerHTML =
    products.map(product => {

      const status = stockStatus(product);

      const expiry = expiryStatus(product);

      const bad =
        status === "Low stock" ||
        expiry === "Expired";

      return `
        <tr>

          <td>
            <div class="table-person">

              <img
                class="product-thumb"
                src="${product.image || fallbackImage(product.name)}"
                onerror="this.onerror=null;this.src='${fallbackImage(product.name)}'"
              >

              <b>${product.name}</b>

            </div>
          </td>

          <td>
            ${product.sku}
            <br>
            <small class="muted-cell">
              ${product.batch || "—"}
            </small>
          </td>

          <td>${product.category}</td>

          <td><b>${product.stock}</b></td>

          <td>${money(product.cost)}</td>

          <td>${money(product.price)}</td>

          <td>${product.expiry || "—"}</td>

          <td>
            <span class="status ${
              bad ? "bad" :
              expiry === "Expiring soon" ||
              status === "Low stock" ? "warn" : ""
            }">
              ${
                expiry === "Expired"
                  ? "Expired"
                  : expiry === "Expiring soon"
                    ? expiry
                    : status
              }
            </span>
          </td>

        </tr>
      `;

    }).join("");

  /* LOW STOCK WATCH */

  const warnings = stockWarnings();

  $("#lowStockList").innerHTML =
    warnings.slice(0, 5).map(product => {

      return `
        <div class="compact-row">

          <span>
            <b>${product.name}</b>
            <small>
              ${product.stock} units · ${product.expiry || "No expiry"}
            </small>
          </span>

          <span class="status warn">
            ${
              product.stock <= product.minStock
                ? "Low stock"
                : expiryStatus(product)
            }
          </span>

        </div>
      `;

    }).join("") ||
    '<div class="empty-state">Stock levels look healthy.</div>';

  $("#inventorySummary").innerHTML = `

    <div class="panel">
      <small>Total product types</small>
      <b>${state.products.length}</b>
    </div>

    <div class="panel">
      <small>Low stock items</small>
      <b class="warning-text">
        ${state.products.filter(p => p.stock <= p.minStock).length}
      </b>
    </div>

    <div class="panel">
      <small>Expiry warnings</small>
      <b>
        ${state.products.filter(p =>
          ["Expired", "Expiring soon"].includes(expiryStatus(p))
        ).length}
      </b>
    </div>

  `;

}

/* CUSTOMER RENDERING */

function renderCustomers() {

  const state = getState();

  const query = (
    $("#customerSearch")?.value || ""
  ).toLowerCase();

  $("#checkoutCustomer").innerHTML = `

    <option value="">Walk-in customer</option>

    ${state.customers.map(customer => `

      <option value="${customer.id}">
        ${customer.name} · ${customer.phone}
      </option>

    `).join("")}

  `;

  const customers = state.customers.filter(customer => {

    return `${customer.name} ${customer.phone}`
      .toLowerCase()
      .includes(query);

  });

  $("#customerRows").innerHTML =
    customers.map(customer => {

      return `
        <tr>

          <td>
            <div class="table-person">

              <span class="person-dot">
                ${customer.name.split(" ").map(x => x[0]).slice(0, 2).join("")}
              </span>

              <b>${customer.name}</b>

            </div>
          </td>

          <td>${customer.phone}</td>

          <td>${money(customer.creditLimit)}</td>

          <td><b>${money(customer.currentDebt)}</b></td>

          <td>${customer.dueDate || "—"}</td>

          <td>
            <span class="status ${customer.currentDebt > 0 ? "warn" : ""}">
              ${customer.currentDebt > 0 ? "Balance due" : "Clear"}
            </span>
          </td>

          <td>

            <button
              class="action-link"
              data-repay="${customer.id}"
            >
              Repay
            </button>

            <button
              class="action-link"
              data-history="${customer.id}"
            >
              History
            </button>

          </td>

        </tr>
      `;

    }).join("") ||
    '<tr><td colspan="7">No customers found.</td></tr>';

  $("#customerCount").textContent =
    state.customers.length;

  $("#debtorsCount").textContent =
    state.customers.filter(
      customer => customer.currentDebt > 0
    ).length;

  $("#customerDebtTotal").textContent =
    money(
      state.customers.reduce(
        (sum, customer) =>
          sum + customer.currentDebt,
        0
      )
    );

  /* SMS LOG */

  $("#smsLogs").innerHTML =
    state.smsLogs.slice(0, 8).map(log => {

      return `
        <article class="sms-item">

          <header>
            <b>${log.type} · ${log.customer}</b>
            <span class="status">${log.status}</span>
          </header>

          <p>${log.message}</p>

          <small class="muted">
            ${log.phone} · ${log.timestamp}
          </small>

        </article>
      `;

    }).join("") ||
    '<div class="empty-state">SMS previews will appear here after credit or repayment activity.</div>';

}

/* M-PESA FEED */

function renderPayments() {

  const state = getState();

  const payments = state.incomingPayments;

  $("#paymentRows").innerHTML =
    payments.map(payment => {

      return `
        <tr>

          <td>
            <b>${payment.name}</b>
            <br>
            <small class="muted-cell">
              ${payment.phone}
            </small>
          </td>

          <td>
            <span class="payment-code">
              ${payment.code}
            </span>
          </td>

          <td>
            ${payment.account} · ${payment.accountNumber}
          </td>

          <td><b>${money(payment.amount)}</b></td>

          <td>${payment.timestamp}</td>

          <td>

            ${
              payment.status === "Matched"

                ? '<span class="status">Matched</span>'

                : `
                  <button
                    class="action-link"
                    data-match="${payment.id}"
                  >
                    Match payment
                  </button>
                `
            }

          </td>

        </tr>
      `;

    }).join("") ||
    `
      <tr>
        <td colspan="6" class="muted-cell">
          Waiting for incoming payments.
          Use “Simulate incoming payment” to test the feed.
        </td>
      </tr>
    `;

  $("#paymentCount").textContent =
    payments.filter(p => p.status !== "Matched").length;

  $("#unmatchedCount").textContent =
    payments.filter(p => p.status !== "Matched").length;

  $("#matchedCount").textContent =
    payments.filter(p => p.status === "Matched").length;

  $("#feedToday").textContent =
    money(
      payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      )
    );

}

/* CONNECTION STATUS */

function renderConnection() {

  const state = getState();

  const element = $("#connectionPill");

  element.classList.toggle(
    "offline",
    !state.online
  );

  element.querySelector("b").textContent =
    state.online ? "Online" : "Offline";

  $("#queueLabel").textContent =
    state.offlineQueue.length
      ? `${state.offlineQueue.length} changes queued`
      : "All changes saved";

}

/* FULL APPLICATION RENDER */

function render() {

  renderKpis();

  renderProducts();

  renderCart();

  renderInventory();

  renderCustomers();

  renderPayments();

  renderConnection();

}

/* ADD PRODUCT MODAL */

function openAddProduct() {

  showModal(

    "Add / restock product",

    "Enter product information. Existing SKU will be restocked.",

    `

      <form>

        <div class="form-grid">

          <div class="form-field full">
            <label>Product name</label>
            <input name="name" required>
          </div>

          <div class="form-field">
            <label>SKU</label>
            <input name="sku" required>
          </div>

          <div class="form-field">
            <label>Barcode</label>
            <input name="barcode">
          </div>

          <div class="form-field">
            <label>Category</label>
            <input name="category" required placeholder="Grocery">
          </div>

          <div class="form-field">
            <label>Quantity to add</label>
            <input name="stock" type="number" min="1" required>
          </div>

          <div class="form-field">
            <label>Cost price (KSh)</label>
            <input name="cost" type="number" min="0" required>
          </div>

          <div class="form-field">
            <label>Selling price (KSh)</label>
            <input name="price" type="number" min="0" required>
          </div>

          <div class="form-field">
            <label>Minimum stock</label>
            <input name="minStock" type="number" min="0" value="5">
          </div>

          <div class="form-field">
            <label>Batch number</label>
            <input name="batch">
          </div>

          <div class="form-field">
            <label>Expiry date</label>
            <input name="expiry" type="date">
          </div>

          <div class="form-field full">
            <label>Product image URL (optional)</label>
            <input name="image" type="url" placeholder="https://…">
          </div>

        </div>

        <div class="modal-actions">

          <button type="button" class="btn btn-secondary" data-close>
            Cancel
          </button>

          <button class="btn btn-primary">
            Save product
          </button>

        </div>

      </form>

    `,

    "Save product",

    formData => {

      addProduct(
        Object.fromEntries(formData)
      );

      closeModal();

      toast("Product inventory updated.");

      render();

    }

  );

}

/* CUSTOMER REGISTRATION MODAL */

function openAddCustomer() {

  showModal(

    "Register customer",

    "Create a customer account for credit purchases.",

    `

      <form>

        <div class="form-grid">

          <div class="form-field full">
            <label>Full name</label>
            <input name="name" required>
          </div>

          <div class="form-field full">
            <label>Phone number</label>
            <input
              name="phone"
              required
              pattern="[0-9+ ]{9,15}"
              placeholder="07XXXXXXXX"
            >
          </div>

          <div class="form-field full">
            <label>Credit limit (KSh)</label>
            <input
              name="creditLimit"
              type="number"
              min="1"
              required
            >
          </div>

        </div>

        <div class="modal-actions">

          <button type="button" class="btn btn-secondary" data-close>
            Cancel
          </button>

          <button class="btn btn-primary">
            Register customer
          </button>

        </div>

      </form>

    `,

    "Register",

    formData => {

      registerCustomer(
        Object.fromEntries(formData)
      );

      closeModal();

      toast("Customer registered.");

      render();

    }

  );

}

/* CUSTOMER REPAYMENT MODAL */

function openRepay(id) {

  const customer = getState().customers.find(
    c => c.id === id
  );

  if (!customer || customer.currentDebt <= 0) {

    toast("This customer has no outstanding debt.");

    return;

  }

  showModal(

    "Record debt repayment",

    `${customer.name} · Current balance ${money(customer.currentDebt)}`,

    `

      <form>

        <div class="form-grid">

          <div class="form-field full">

            <label>Repayment amount (KSh)</label>

            <input
              name="amount"
              type="number"
              min="1"
              max="${customer.currentDebt}"
              value="${customer.currentDebt}"
              required
            >

          </div>

          <div class="form-field full">

            <label>Payment method</label>

            <select name="method">
              <option>Cash</option>
              <option>M-Pesa Paybill</option>
              <option>M-Pesa Till</option>
            </select>

          </div>

        </div>

        <div class="modal-actions">

          <button type="button" class="btn btn-secondary" data-close>
            Cancel
          </button>

          <button class="btn btn-primary">
            Record repayment
          </button>

        </div>

      </form>

    `,

    "Record",

    formData => {

      const data = Object.fromEntries(formData);

      repayDebt(
        id,
        data.amount,
        data.method
      );

      closeModal();

      toast(
        "Repayment recorded; SMS confirmation preview created."
      );

      render();

    }

  );

}

/* MATCH INCOMING PAYMENT */

function matchPayment(id) {

  const payment = getState().incomingPayments.find(
    p => p.id === id
  );

  if (!payment) return;

  const customers = getState().customers;

  showModal(

    "Match incoming payment",

    `${payment.code} · ${money(payment.amount)}`,

    `

      <form>

        <div class="form-field">

          <label>Apply payment to</label>

          <select name="target">

            <option value="cart">
              Active cart payment
            </option>

            ${customers.filter(c => c.currentDebt > 0).map(customer => `

              <option value="${customer.id}">
                Debt: ${customer.name} · ${money(customer.currentDebt)}
              </option>

            `).join("")}

          </select>

        </div>

        <div class="modal-actions">

          <button type="button" class="btn btn-secondary" data-close>
            Cancel
          </button>

          <button class="btn btn-primary">
            Confirm match
          </button>

        </div>

      </form>

    `,

    "Match",

    formData => {

      const target = formData.get("target");

      if (target === "cart") {

        const cartTotal = totals().total;

        if (
          !getState().cart.length ||
          Math.abs(payment.amount - cartTotal) > 0.01
        ) {

          throw Error(
            `Active cart total is ${money(cartTotal)}. Payment must match exactly in this demo.`
          );

        }

        const sale = checkout("M-Pesa");

        printReceipt(sale);

      } else {

        const customer = getState().customers.find(
          c => c.id === target
        );

        if (payment.amount > customer.currentDebt) {

          throw Error(
            "Payment is greater than the customer's debt. Record a partial repayment instead."
          );

        }

        repayDebt(
          customer.id,
          payment.amount,
          "M-Pesa Paybill/Till"
        );

      }

      update(state => {

        const item = state.incomingPayments.find(
          p => p.id === id
        );

        item.status = "Matched";

        item.matchedTo =
          target === "cart" ? "Cart" : target;

      });

      closeModal();

      toast("Incoming payment matched.");

      render();

    }

  );

}

/* CHECKOUT HANDLER */

function handleCheckout(credit) {

  const state = getState();

  const customerId = $("#checkoutCustomer").value;

  if (!state.cart.length) {

    toast(
      "Add products to the basket first.",
      "error"
    );

    return;

  }

  try {

    if (credit) {

      if (!customerId) {

        throw Error(
          "Select a registered customer to use credit."
        );

      }

      const customer = state.customers.find(
        c => c.id === customerId
      );

      if (customer.currentDebt > 0) {
        /* The credit engine generates the reminder. */
      }

      const dueDate = new Date();

      dueDate.setDate(
        dueDate.getDate() + 14
      );

      const sale = makeDebtSale(
        customerId,
        state.cart,
        totals().total,
        dueDate.toISOString().slice(0, 10),
        state.cashier
      );

      toast(
        "Credit sale recorded and SMS preview generated."
      );

      printReceipt(sale);

    } else {

      showModal(

        "Complete payment",

        "Choose how the customer is paying.",

        `

          <div class="form-grid">

            <button class="btn btn-secondary" data-method="Cash">
              💵 Cash
            </button>

            <button class="btn btn-secondary" data-method="M-Pesa">
              ▣ M-Pesa
            </button>

            <button class="btn btn-secondary" data-method="Card">
              ▤ Card
            </button>

          </div>

          <p class="muted" style="font-size:10px;margin-top:14px">

            M-Pesa is simulated in this front-end demo.
            No real money will be collected.

          </p>

        `

      );

      $$("[data-method]").forEach(button => {

        button.onclick = () => {

          try {

            const sale = checkout(
              button.dataset.method,
              customerId
            );

            closeModal();

            toast("Sale completed successfully.");

            printReceipt(sale);

            render();

          } catch (error) {

            toast(error.message, "error");

          }

        };

      });

    }

  } catch (error) {

    toast(error.message, "error");

  }

  render();

}

/* INITIALIZE APPLICATION */

function init() {

  /* M-PESA */

  initMpesaFeed(() => {

    renderPayments();

    toast("Incoming M-Pesa payment received.");

  });

  /* STATE SUBSCRIPTION */

  subscribe(render);

  render();

  /* NAVIGATION */

  $$(".nav-item[data-view]").forEach(button => {

    button.addEventListener("click", () => {
      switchView(button.dataset.view);
    });

  });

  $$("[data-goto]").forEach(button => {

    button.addEventListener("click", () => {
      switchView(button.dataset.goto);
    });

  });

  /* MOBILE MENU */

  $("#menuToggle").onclick = () => {
    $("#sidebar").classList.toggle("open");
  };

  /* THEME */

  $("#themeToggle").onclick = () => {

    document.body.classList.toggle("light");

    drawChart($("#salesChart"));

  };

  /* ONLINE / OFFLINE MODE */

  $("#modeToggle").onclick = () => {

    const next = !getState().online;

    setOnline(next);

    if (next) {

      const count = flushQueue();

      toast(
        `Online mode enabled. ${count} queued local changes marked synced.`
      );

    } else {

      toast(
        "Offline mode enabled. Changes will be queued."
      );

    }

  };

  /* SEARCH */

  $("#productSearch").oninput = renderProducts;

  $("#inventorySearch").oninput = renderInventory;

  $("#customerSearch").oninput = renderCustomers;

  /* ADD PRODUCT */

  $("#productGrid").onclick = event => {

    const tile = event.target.closest("[data-product]");

    if (!tile) return;

    try {

      addToCart(tile.dataset.product);

    } catch (error) {

      toast(error.message, "error");

    }

  };

  /* CART QUANTITY */

  $("#cartLines").onclick = event => {

    const quantityButton = event.target.closest("[data-qty]");

    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {

      changeQty(
        quantityButton.dataset.qty,
        Number(quantityButton.dataset.delta)
      );

    }

    if (removeButton) {

      changeQty(
        removeButton.dataset.remove,
        -999
      );

    }

  };

  /* DISCOUNT */

  $("#discountInput").onchange = event => {

    setDiscount(event.target.value);

  };

  /* CLEAR CART */

  $("#clearCart").onclick = () => {

    clearCart();

    toast("Basket cleared.");

  };

  /* CHECKOUT */

  $("#payCheckout").onclick = () => {
    handleCheckout(false);
  };

  $("#debtCheckout").onclick = () => {
    handleCheckout(true);
  };

  /* INVENTORY */

  $("#addProductBtn").onclick = openAddProduct;

  /* CUSTOMER REGISTRATION */

  $("#addCustomerBtn").onclick = openAddCustomer;

  /* M-PESA SIMULATOR */

  $("#simulatePayment").onclick = () => {

    const payment = simulateIncoming();

    toast(
      `Received ${money(payment.amount)} from ${payment.name}.`
    );

  };

  /* MATCH PAYMENT */

  $("#paymentRows").onclick = event => {

    const button = event.target.closest("[data-match]");

    if (button) {
      matchPayment(button.dataset.match);
    }

  };

  /* CUSTOMER ACTIONS */

  $("#customerRows").onclick = event => {

    const repayment = event.target.closest("[data-repay]");

    const history = event.target.closest("[data-history]");

    if (repayment) {
      openRepay(repayment.dataset.repay);
    }

    if (history) {

      const customer = getState().customers.find(
        c => c.id === history.dataset.history
      );

      showModal(

        `${customer.name} — account history`,

        `Current balance ${money(customer.currentDebt)}`,

        `

          <div class="compact-list">

            ${(customer.history || []).map(item => `

              <div class="compact-row">

                <span>
                  <b>${item.type}</b>
                  <small>${item.date}</small>
                </span>

                <b>${money(item.amount)}</b>

              </div>

            `).join("") ||

              '<p class="muted">No account activity yet.</p>'}

          </div>

        `

      );

    }

  };

  /* EXPORT */

  $("#exportCsv").onclick = exportSalesCsv;

  /* BARCODE SIMULATOR */

  $("#scanSim").onclick = () => {

    const products = getState().products;

    const product = products[
      Math.floor(Math.random() * products.length)
    ];

    $("#productSearch").value = product.barcode;

    category = "All";

    renderProducts();

    toast(
      `Barcode simulated: ${product.barcode}`
    );

  };

  /* MODALS */

  $("#modalClose").onclick = closeModal;

  $("#modalBackdrop").onclick = event => {

    if (event.target.id === "modalBackdrop") {
      closeModal();
    }

  };

  $("#modalBody").onclick = event => {

    if (event.target.closest("[data-close]")) {
      closeModal();
    }

  };

  /* CASHIER SETTINGS */

  $("#cashierEdit").onclick = () => {

    showModal(

      "Cashier profile",

      "Set the attendant name printed on receipts and SMS previews.",

      `

        <form>

          <div class="form-field">

            <label>Cashier name</label>

            <input
              name="cashier"
              value="${getState().cashier}"
              required
            >

          </div>

          <div class="modal-actions">

            <button class="btn btn-primary">
              Save
            </button>

          </div>

        </form>

      `,

      "Save",

      formData => {

        update(
          state => {
            state.cashier = formData.get("cashier");
          },
          { queue: false }
        );

        closeModal();

        toast("Cashier profile updated.");

      }

    );

  };

  /* NOTIFICATIONS */

  $("#notifyBtn").onclick = () => {

    switchView("payments");

    toast("Payment feed opened.");

  };

  /* BROWSER CONNECTION */

  window.addEventListener("online", () => {

    setOnline(true);

    flushQueue();

    toast("Browser connection restored.");

  });

  window.addEventListener("offline", () => {

    setOnline(false);

    toast(
      "Browser is offline. Local changes remain available."
    );

  });

  /* RESPONSIVE CHART */

  window.addEventListener("resize", () => {

    drawChart($("#salesChart"));

  });

  /* CROSS-TAB STORAGE */

  window.addEventListener("storage", render);

}

/* START */

init();
