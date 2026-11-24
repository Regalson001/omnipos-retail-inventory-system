
/* =========================================
   OMNIPOS — CUSTOMER CREDIT & SMS ENGINE
   ========================================= */

import {
  getState,
  update
} from "./state.js";

import {
  SHOP,
  money,
  uid,
  dateTime
} from "./data.js";

/* CENTRAL SMS LOGGING */

function logSms(customer, message, type) {

  const item = {

    id: uid("sms"),

    customerId: customer.id,

    customer: customer.name,

    phone: customer.phone,

    message,

    type,

    status: "Preview generated",

    timestamp: dateTime()

  };

  update(state => {
    state.smsLogs.unshift(item);
  });

  return item;

}

/* DEBT PURCHASE SMS */

export function smsForDebt(
  customer,
  items,
  total,
  dueDate,
  cashier
) {

  const lines = items.map(item => {

    return `• ${item.name} x${item.qty}: ${
      money(item.price * item.qty)
    }`;

  }).join("\n");

  const message = `

${SHOP.name}

Served by: ${cashier}

Customer: ${customer.name}

Phone: ${customer.phone}

Date: ${dateTime()}

Items:
${lines}

Transaction total: ${money(total)}

Total outstanding debt: ${money(customer.currentDebt)}

Payment due: ${dueDate}

Thank you for shopping with us.

  `.trim();

  return logSms(
    customer,
    message,
    "Debt purchase"
  );

}

/* UNPAID DEBT REMINDER */

export function smsDebtGuard(customer) {

  const message = `

Hello ${customer.name},

Please clear your existing outstanding balance of ${
    money(customer.currentDebt)
  } before taking another purchase on credit.

Due date: ${
    customer.dueDate || "Please contact the store"
  }.

Thank you,
${SHOP.name}

  `.trim();

  return logSms(
    customer,
    message,
    "Debt reminder"
  );

}

/* REPAYMENT CONFIRMATION */

export function smsRepayment(
  customer,
  paid,
  method
) {

  const message = `

Hello ${customer.name},

We have received your ${
    money(paid)
  } repayment via ${method}.

Remaining balance: ${
    money(customer.currentDebt)
  }.

Thank you,
${SHOP.name}

  `.trim();

  return logSms(
    customer,
    message,
    "Repayment confirmation"
  );

}

/* REGISTER CUSTOMER */

export function registerCustomer(data) {

  const customer = {

    id: uid("cust"),

    name: data.name.trim(),

    phone: data.phone.trim(),

    creditLimit: Number(data.creditLimit),

    currentDebt: 0,

    dueDate: "",

    history: []

  };

  update(state => {
    state.customers.push(customer);
  });

  return customer;

}

/* CREDIT PURCHASE */

export function makeDebtSale(
  customerId,
  cart,
  total,
  dueDate,
  cashier
) {

  const state = getState();

  const customer = state.customers.find(
    c => c.id === customerId
  );

  if (!customer) {
    throw Error("Select a registered customer.");
  }

  /*
   * IMPORTANT:
   * Existing debt blocks a new credit purchase.
   */

  if (customer.currentDebt > 0) {

    smsDebtGuard(customer);

    throw Error(
      `${customer.name} has an unpaid balance of ${
        money(customer.currentDebt)
      }. Clear the existing debt before another credit purchase.`
    );

  }

  if (total > customer.creditLimit) {

    throw Error(
      `Credit limit exceeded. Available limit: ${
        money(customer.creditLimit)
      }.`
    );

  }

  const items = cart.map(item => ({ ...item }));

  const sale = {

    id: uid("sale"),

    receipt: uid("RCPT").toUpperCase(),

    timestamp: dateTime(),

    customerId,

    customer: customer.name,

    items,

    total,

    method: "Credit",

    cogs: items.reduce(
      (total, item) => total + item.cost * item.qty,
      0
    )

  };

  /* SAVE TRANSACTION AND DEDUCT STOCK */

  update(state => {

    items.forEach(item => {

      const product = state.products.find(
        p => p.id === item.id
      );

      if (!product || product.stock < item.qty) {

        throw Error(
          `Insufficient stock for ${item.name}`
        );

      }

      product.stock -= item.qty;

    });

    const account = state.customers.find(
      c => c.id === customerId
    );

    account.currentDebt += total;

    account.dueDate = dueDate;

    account.history.unshift({

      type: "Credit purchase",

      amount: total,

      date: sale.timestamp,

      items

    });

    state.sales.unshift(sale);

    state.debtTransactions.unshift({
      ...sale,
      type: "Debt"
    });

    state.cart = [];

    state.discount = 0;

  });

  const updatedCustomer = getState().customers.find(
    c => c.id === customerId
  );

  smsForDebt(
    updatedCustomer,
    items,
    total,
    dueDate,
    cashier
  );

  return sale;

}

/* FULL OR PARTIAL REPAYMENT */

export function repayDebt(
  customerId,
  amount,
  method
) {

  const customer = getState().customers.find(
    c => c.id === customerId
  );

  amount = Number(amount);

  if (
    !customer ||
    amount <= 0 ||
    amount > customer.currentDebt
  ) {

    throw Error(
      "Enter a valid repayment amount up to the outstanding balance."
    );

  }

  update(state => {

    const account = state.customers.find(
      c => c.id === customerId
    );

    account.currentDebt = Math.max(
      0,
      account.currentDebt - amount
    );

    if (account.currentDebt === 0) {
      account.dueDate = "";
    }

    account.history.unshift({

      type: "Repayment",

      amount,

      date: dateTime(),

      method

    });

    state.debtTransactions.unshift({

      id: uid("repay"),

      customerId,

      customer: account.name,

      type: "Repayment",

      amount,

      method,

      timestamp: dateTime()

    });

  });

  const updatedCustomer = getState().customers.find(
    c => c.id === customerId
  );

  smsRepayment(
    updatedCustomer,
    amount,
    method
  );

}
