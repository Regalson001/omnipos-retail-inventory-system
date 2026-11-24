
/* =========================================
   OMNIPOS — M-PESA INCOMING PAYMENT FEED
   ========================================= */

import {
  getState,
  update,
  enqueue
} from "./state.js";

import {
  uid,
  dateTime
} from "./data.js";

let channel;

/* INITIALIZE PAYMENT LISTENER */

export function initMpesaFeed(onChange = () => {}) {

  try {

    channel = new BroadcastChannel("omnipos-mpesa");

    channel.onmessage = event => {
      receive(event.data, onChange);
    };

  } catch (error) {

    console.warn("BroadcastChannel unavailable:", error);

  }

  window.addEventListener("omnipos:mpesa", event => {
    receive(event.detail, onChange);
  });

}

/* RECEIVE PAYMENT */

export function receive(raw, onChange = () => {}) {

  if (!raw || !raw.amount || !raw.code) {
    return false;
  }

  const payment = {

    id: uid("mpesa"),

    name: raw.name || "M-Pesa customer",

    phone: raw.phone || "Not supplied",

    amount: Number(raw.amount),

    code: String(raw.code).toUpperCase(),

    account: raw.account || "Till",

    accountNumber: raw.accountNumber || "8349210",

    timestamp: raw.timestamp || dateTime(),

    status: "Unmatched",

    matchedTo: null

  };

  update(state => {

    const duplicate = state.incomingPayments.some(
      item => item.code === payment.code
    );

    if (!duplicate) {
      state.incomingPayments.unshift(payment);
    }

  });

  if (!getState().online) {
    enqueue("incoming-payment", payment);
  }

  onChange();

  return true;

}

/* SIMULATE INCOMING M-PESA TRANSACTION */

export function simulateIncoming() {

  const names = [
    "Brian Otieno",
    "Faith Njeri",
    "Peter Kamau",
    "Lilian Achieng"
  ];

  const payment = {

    name: names[
      Math.floor(Math.random() * names.length)
    ],

    phone: `07${Math.floor(
      10000000 + Math.random() * 89999999
    )}`,

    amount: [350, 650, 1200, 1850, 2400][
      Math.floor(Math.random() * 5)
    ],

    code: Math.random()
      .toString(36)
      .slice(2, 12)
      .toUpperCase(),

    account: Math.random() > 0.5
      ? "Paybill"
      : "Till",

    accountNumber: Math.random() > 0.5
      ? "522522"
      : "8349210",

    timestamp: dateTime()

  };

  receive(payment);

  return payment;

}

/* BROADCAST TEST EVENT */

export function broadcastTest(payment) {

  if (channel) {
    channel.postMessage(payment);
  } else {
    receive(payment);
  }

}
