
/* =========================================
   OMNIPOS — APPLICATION DATA
   ========================================= */

export const SHOP = {
  name: "Northstar Market",
  location: "Westlands, Nairobi",
  paybill: "522522",
  till: "8349210",
  vat: 0.16
};

/* CURRENCY */

export const money = (amount) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);
};

/* UNIQUE IDENTIFIERS */

export const uid = (prefix) => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36).slice(2, 7)}`;
};

/* DATE UTILITIES */

export const today = () => {
  return new Date().toISOString().slice(0, 10);
};

export const dateTime = () => {
  return new Date().toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short"
  });
};

/* SVG IMAGE FALLBACK */

export const fallbackImage = (label = "Product") => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="350">
      <rect width="100%" height="100%" fill="#e8eef2"/>
      <circle cx="250" cy="145" r="55" fill="#d0ddd9"/>
      <path d="M190 260h120" stroke="#a7b8b1"
        stroke-width="12" stroke-linecap="round"/>
      <text x="250" y="310" font-family="Arial"
        font-size="20" fill="#63756e" text-anchor="middle">
        ${label.replace(/[<>&]/g, "")}
      </text>
    </svg>
  `)}`;
};

/* PRODUCT IMAGE SOURCE */

const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

/* INITIAL PRODUCT CATALOGUE */

export const seedProducts = [

  {
    id: "p1",
    name: "Fresh Milk 500ml",
    sku: "DRK-001",
    barcode: "616110001001",
    category: "Dairy",
    stock: 32,
    minStock: 10,
    cost: 48,
    price: 65,
    batch: "MLK-2411",
    expiry: "2026-12-05",
    image: img("photo-1563636619-e9143da7973b")
  },

  {
    id: "p2",
    name: "Farm Eggs — 6 Pack",
    sku: "DRY-002",
    barcode: "616110001002",
    category: "Dairy",
    stock: 18,
    minStock: 8,
    cost: 115,
    price: 145,
    batch: "EGG-2411",
    expiry: "2026-12-02",
    image: img("photo-1518569656558-1f25e69d93d7")
  },

  {
    id: "p3",
    name: "Whole Wheat Bread",
    sku: "BAK-003",
    barcode: "616110001003",
    category: "Bakery",
    stock: 5,
    minStock: 8,
    cost: 52,
    price: 70,
    batch: "BRD-2411",
    expiry: "2026-11-27",
    image: img("photo-1509440159596-0249088772ff")
  },

  {
    id: "p4",
    name: "Mineral Water 1L",
    sku: "DRK-004",
    barcode: "616110001004",
    category: "Beverages",
    stock: 64,
    minStock: 15,
    cost: 35,
    price: 50,
    batch: "WTR-2410",
    expiry: "2027-08-01",
    image: img("photo-1602143407151-7111542de6e8")
  },

  {
    id: "p5",
    name: "Orange Juice 1L",
    sku: "DRK-005",
    barcode: "616110001005",
    category: "Beverages",
    stock: 14,
    minStock: 8,
    cost: 120,
    price: 165,
    batch: "JCE-2409",
    expiry: "2026-12-18",
    image: img("photo-1600271886742-f049cd451bba")
  },

  {
    id: "p6",
    name: "Paracetamol 500mg",
    sku: "PHM-006",
    barcode: "616110001006",
    category: "Pharmacy",
    stock: 42,
    minStock: 12,
    cost: 28,
    price: 45,
    batch: "PCM-0926",
    expiry: "2027-09-30",
    image: img("photo-1584308666744-24d5c474f2ae")
  },

  {
    id: "p7",
    name: "Hand Sanitizer 250ml",
    sku: "PHM-007",
    barcode: "616110001007",
    category: "Pharmacy",
    stock: 7,
    minStock: 10,
    cost: 95,
    price: 135,
    batch: "SAN-0826",
    expiry: "2027-08-30",
    image: img("photo-1584744982491-665216d95f8b")
  },

  {
    id: "p8",
    name: "Laundry Detergent 1kg",
    sku: "HOM-008",
    barcode: "616110001008",
    category: "Home care",
    stock: 21,
    minStock: 8,
    cost: 145,
    price: 195,
    batch: "LDY-1026",
    expiry: "2028-10-01",
    image: img("photo-1585421514738-01798e348b17")
  },

  {
    id: "p9",
    name: "Cooking Oil 1L",
    sku: "GRC-009",
    barcode: "616110001009",
    category: "Grocery",
    stock: 4,
    minStock: 10,
    cost: 210,
    price: 265,
    batch: "OIL-1126",
    expiry: "2027-05-30",
    image: img("photo-1474979266404-7eaacbcd87c5")
  },

  {
    id: "p10",
    name: "Premium Rice 2kg",
    sku: "GRC-010",
    barcode: "616110001010",
    category: "Grocery",
    stock: 27,
    minStock: 10,
    cost: 260,
    price: 330,
    batch: "RIC-1126",
    expiry: "2027-11-01",
    image: img("photo-1586201375761-83865001e31c")
  },

  {
    id: "p11",
    name: "Chocolate Bar",
    sku: "SNK-011",
    barcode: "616110001011",
    category: "Snacks",
    stock: 38,
    minStock: 12,
    cost: 45,
    price: 70,
    batch: "CHO-1126",
    expiry: "2027-02-01",
    image: img("photo-1548907040-4d42a9f4f3a5")
  },

  {
    id: "p12",
    name: "Baby Wipes 80s",
    sku: "BAB-012",
    barcode: "616110001012",
    category: "Personal care",
    stock: 16,
    minStock: 7,
    cost: 130,
    price: 175,
    batch: "WIP-1026",
    expiry: "2028-04-01",
    image: img("photo-1600857544200-b2f666a9a2ec")
  }

];

/* INITIAL CUSTOMER ACCOUNTS */

export const seedCustomers = [

  {
    id: "c1",
    name: "Grace Wanjiku",
    phone: "0712345678",
    creditLimit: 5000,
    currentDebt: 0,
    dueDate: "",
    history: []
  },

  {
    id: "c2",
    name: "David Mwangi",
    phone: "0723456789",
    creditLimit: 8000,
    currentDebt: 1250,
    dueDate: "2026-11-28",
    history: []
  },

  {
    id: "c3",
    name: "Mary Atieno",
    phone: "0700123456",
    creditLimit: 3000,
    currentDebt: 0,
    dueDate: "",
    history: []
  }

];
