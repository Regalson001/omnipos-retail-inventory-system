
/* =========================================
   OMNIPOS — BUSINESS ANALYTICS
   ========================================= */

import {
  getState
} from "./state.js";

/* METRICS */

export function metrics() {

  const state = getState();

  const sales = state.sales.filter(
    sale => sale.method !== "Credit"
  );

  const revenue = state.sales.reduce(
    (total, sale) => total + sale.total,
    0
  );

  const cogs = state.sales.reduce(
    (total, sale) => total + (sale.cogs || 0),
    0
  );

  const debt = state.customers.reduce(
    (total, customer) =>
      total + customer.currentDebt,
    0
  );

  return {

    revenue,

    cogs,

    profit: revenue - cogs,

    debt,

    transactions: state.sales.length,

    margin: revenue
      ? ((revenue - cogs) / revenue) * 100
      : 0,

    average: state.sales.length
      ? revenue / state.sales.length
      : 0,

    payments: sales

  };

}

/* SALES CHART */

export function drawChart(canvas) {

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;

  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  const width = rect.width;

  const height = rect.height;

  const state = getState();

  const days = Array.from(
    { length: 7 },
    (_, index) => {

      const date = new Date();

      date.setDate(
        date.getDate() - (6 - index)
      );

      return date.toLocaleDateString(
        "en",
        { weekday: "short" }
      );

    }
  );

  const values = days.map((_, index) => {

    const target = new Date();

    target.setDate(
      target.getDate() - (6 - index)
    );

    return state.sales
      .filter(sale =>
        new Date(sale.timestamp).toDateString() ===
        target.toDateString()
      )
      .reduce(
        (total, sale) => total + sale.total,
        0
      );

  });

  const max = Math.max(100, ...values) * 1.2;

  ctx.strokeStyle = getComputedStyle(
    document.body
  ).getPropertyValue("--line");

  ctx.fillStyle = getComputedStyle(
    document.body
  ).getPropertyValue("--muted");

  ctx.font = "10px DM Sans";

  /* GRID */

  for (let i = 0; i < 4; i++) {

    const y = 12 + (height - 42) * i / 3;

    ctx.beginPath();

    ctx.moveTo(30, y);

    ctx.lineTo(width - 8, y);

    ctx.stroke();

  }

  /* REVENUE LINE */

  ctx.beginPath();

  values.forEach((value, index) => {

    const x = 36 + (width - 52) * index / 6;

    const y =
      height - 29 -
      (height - 58) * value / max;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

  });

  ctx.strokeStyle = "#36d6a5";

  ctx.lineWidth = 2.5;

  ctx.stroke();

  /* DATA POINTS */

  values.forEach((value, index) => {

    const x = 36 + (width - 52) * index / 6;

    const y =
      height - 29 -
      (height - 58) * value / max;

    ctx.beginPath();

    ctx.arc(x, y, 3.5, 0, Math.PI * 2);

    ctx.fillStyle = "#36d6a5";

    ctx.fill();

    ctx.fillStyle = getComputedStyle(
      document.body
    ).getPropertyValue("--muted");

    ctx.fillText(
      days[index],
      x - 10,
      height - 8
    );

  });

}

/* CSV EXPORT */

export function exportSalesCsv() {

  const rows = [

    [
      "Receipt",
      "Timestamp",
      "Customer",
      "Items",
      "Payment",
      "Total KES",
      "COGS KES"
    ],

    ...getState().sales.map(sale => [

      sale.receipt,

      sale.timestamp,

      sale.customer,

      sale.items.map(item =>
        `${item.name} x${item.qty}`
      ).join("; "),

      sale.method,

      sale.total,

      sale.cogs || 0

    ])

  ];

  const csv = rows.map(row => {

    return row.map(value => {

      return `"${String(value ?? "").replaceAll('"', '""')}"`;

    }).join(",");

  }).join("\n");

  const url = URL.createObjectURL(
    new Blob([csv], {
      type: "text/csv"
    })
  );

  const link = document.createElement("a");

  link.href = url;

  link.download = "omnipos-sales-export.csv";

  link.click();

  URL.revokeObjectURL(url);

}
