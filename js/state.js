
/* =========================================
   OMNIPOS — APPLICATION STATE
   ========================================= */

import {
  seedProducts,
  seedCustomers,
  uid
} from "./data.js";

const STORAGE_KEY = "omnipos-retail-v1";

/* INITIAL APPLICATION STATE */

const defaults = () => ({
  products: structuredClone(seedProducts),

  cart: [],

  sales: [],

  customers: structuredClone(seedCustomers),

  debtTransactions: [],

  smsLogs: [],

  incomingPayments: [],

  offlineQueue: [],

  online: true,

  cashier: "Store Admin",

  discount: 0
});

let state;

/* LOAD SAVED STATE */

function load() {
  try {

    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return saved
      ? { ...defaults(), ...saved }
      : defaults();

  } catch (error) {

    console.error("Unable to load saved state:", error);

    return defaults();

  }
}

state = load();

/* SUBSCRIBERS */

const listeners = new Set();

export function getState() {
  return state;
}

export function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

  listeners.forEach(listener => listener(state));
}

export function subscribe(callback) {
  listeners.add(callback);

  return () => listeners.delete(callback);
}

/* UPDATE APPLICATION STATE */

export function update(mutator, { queue = true } = {}) {

  mutator(state);

  if (!state.online && queue) {

    state.offlineQueue.push({
      id: uid("sync"),
      at: new Date().toISOString(),
      type: "local-change"
    });

  }

  save();
}

/* RESET DEMO */

export function resetDemo() {

  state = defaults();

  save();

}

/* CONNECTION STATUS */

export function setOnline(value) {

  update(
    s => {
      s.online = value;
    },
    { queue: false }
  );

}

/* QUEUE OFFLINE CHANGES */

export function enqueue(type, payload) {

  update(
    s => {
      s.offlineQueue.push({
        id: uid("sync"),
        type,
        payload,
        at: new Date().toISOString()
      });
    },
    { queue: false }
  );

}

/* PROCESS DEMO QUEUE */

export function flushQueue() {

  if (!state.online) return 0;

  const count = state.offlineQueue.length;

  update(
    s => {
      s.offlineQueue = [];
    },
    { queue: false }
  );

  return count;

}
