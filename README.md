<p align="center">
  <strong>One platform. Every sale. Complete control.</strong>
</p>

<p align="center">
  Empowering modern retailers with smarter sales, seamless inventory management, and data-driven business insights.
</p>

<p align="center">
  <img src="assets/logo.svg" alt="OmniPOS Logo" width="110" />
</p>

<p align="center">
  <strong>A modern retail management and Point-of-Sale experience built for smarter business operations.</strong>
</p>

---

## Overview

**OmniPOS** is a modern, responsive Omnichannel Retail and Inventory Management System designed to simplify retail operations through a unified, intuitive dashboard.

The platform brings essential retail workflows together, helping businesses manage product inventory, process sales, monitor stock levels, track customers, manage outstanding balances, and understand business performance.

Built using HTML5, modern CSS3, and vanilla JavaScript, OmniPOS demonstrates how lightweight web technologies can deliver a polished, efficient, and feature-rich retail management experience.

Whether managing a small retail shop or exploring modern retail technology, OmniPOS showcases a smarter approach to everyday business operations.

## Why OmniPOS?

Retail businesses need more than a basic checkout interface. They need visibility, control, and reliable information to make better operational decisions.

OmniPOS brings these capabilities together in one streamlined platform.

### Key Business Benefits

**1. Business Efficiency**

Simplifies everyday retail activities by bringing sales, inventory, customer records, and business operations into one accessible interface.

**2. Intelligent Inventory Visibility**

Monitor stock quantities, identify low-stock products, track product batches, and receive expiry-date warnings to support better inventory control.

**3. Sales Intelligence**

Explore sales performance, revenue trends, and business activity through an analytics-focused dashboard.

**4. Customer Management**

Maintain customer records, monitor outstanding balances, and manage customer credit transactions.

**5. Modern Checkout Experience**

Manage shopping carts, adjust product quantities, calculate totals, process simulated payment transactions, and generate printable receipts.

**6. Modern User Experience**

Work with a clean, responsive dashboard featuring intuitive navigation, organized information, and a modern retail technology aesthetic.

---

## Core Features

| Feature | Description |
|---|---|
| Product Management | Manage products, pricing, and stock quantities |
| Inventory Tracking | Monitor stock levels and product availability |
| Low-Stock Alerts | Identify products requiring restocking |
| Expiry Monitoring | Track product expiry and batch information |
| Point of Sale | Add products to carts and process sales |
| Shopping Cart | Manage quantities, items, and checkout totals |
| Payment Simulation | Demonstrate cash and simulated M-Pesa payment workflows |
| Digital Receipts | Generate and print transaction receipts |
| Customer Management | Maintain customer records |
| Credit Tracking | Monitor customer balances and outstanding payments |
| Sales Analytics | Review sales activity and business performance |
| Dashboard | Access key business information in one place |
| Local Data Persistence | Retain application data using browser LocalStorage |
| Responsive Interface | Adapt the interface to different screen sizes |
| Dark/Light Mode | Switch between dashboard appearance modes |

---

## Technology Stack

OmniPOS is built with lightweight, modern web technologies without requiring external frontend frameworks or backend dependencies.

### Frontend

- **HTML5** — Semantic application structure.
- **CSS3** — Modern styling, layouts, responsive design, and visual components.
- **JavaScript ES6+** — Application logic, state management, interactions, and business workflows.

### Browser Capabilities

- LocalStorage for local data persistence.
- Canvas API for dashboard visualizations.
- Browser printing for printable receipts.
- Responsive CSS Grid and Flexbox layouts.

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Modern web browsers

---

## Application Architecture

The project uses a modular frontend structure to separate application responsibilities and improve maintainability.

```text
omnipos-retail-inventory-system/
│
├── index.html
│
├── assets/
│   └── logo.svg
│
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── print.css
│
├── js/
│   ├── data.js
│   ├── state.js
│   ├── mpesa-feed.js
│   ├── debt-sms.js
│   ├── inventory.js
│   ├── cart-checkout.js
│   ├── analytics.js
│   └── app.js
│
├── README.md
└── .gitignore
```

---

## Getting Started

Follow these steps to run OmniPOS locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Regalson001/omnipos-retail-inventory-system.git
```

### 2. Navigate into the Project

```bash
cd omnipos-retail-inventory-system
```

### 3. Open in Visual Studio Code

```bash
code .
```

### 4. Start a Local Development Server

Using Python:

```bash
python -m http.server 8000
```

### 5. Open in Your Browser

Visit:

```text
http://localhost:8000
```

Alternatively, open the project using the VS Code Live Server extension.

---

## How OmniPOS Works

The application brings together several essential retail workflows:

1. **Inventory Management:** View products, monitor quantities, and identify low-stock items.
2. **Sales Processing:** Select products, manage cart quantities, and calculate checkout totals.
3. **Payment Workflow:** Select cash or simulated M-Pesa payment and view transaction feedback.
4. **Receipt Generation:** Produce a printable receipt after a transaction.
5. **Customer Management:** Maintain customer information and track outstanding credit.
6. **Business Analytics:** Review sales information and performance indicators.

---

## Screenshots & Application Preview

Screenshots of the dashboard, inventory management, point-of-sale interface, checkout experience, and analytics can be added here.

Suggested screenshot structure:

```text
screenshots/
├── dashboard.png
├── inventory.png
├── point-of-sale.png
├── checkout.png
└── analytics.png
```

Add screenshots to this directory and embed them below:

```markdown
![OmniPOS Dashboard](screenshots/dashboard.png)

![Inventory Management](screenshots/inventory.png)

![Point of Sale](screenshots/point-of-sale.png)

![Sales Analytics](screenshots/analytics.png)
```

---

## Design Philosophy

OmniPOS follows a modern SaaS-inspired design approach focused on usability, clarity, and operational efficiency.

Key design principles include:

- Clean and intuitive dashboard layouts.
- Consistent spacing and visual hierarchy.
- Responsive CSS Grid and Flexbox architecture.
- Reusable interface components.
- Accessible and readable typography.
- Modern light and dark themes.
- Clear visual feedback for important actions.
- Minimal friction across common retail workflows.

The goal is to make everyday retail management more accessible and efficient.

---

## Project Scope & Limitations

OmniPOS is currently a frontend demonstration and does not connect to a production backend.

The following capabilities are simulated or browser-based:

- **M-Pesa:** Simulated payment workflow; no live Safaricom Daraja API connection.
- **SMS Notifications:** Demonstration functionality; no actual SMS gateway integration.
- **Data Storage:** Browser LocalStorage; no centralized database or cross-device synchronization.
- **Authentication:** No production-grade authentication or role-based access control.
- **Offline Synchronization:** Local demonstration behavior; no remote server synchronization.

For production deployment, these capabilities would require secure backend services and appropriate integrations.

---

## Future Development Roadmap

OmniPOS is designed with room for expansion into a complete retail management platform.

Potential future improvements include:

- [ ] Python FastAPI backend.
- [ ] PostgreSQL database integration.
- [ ] Secure authentication and role-based access control.
- [ ] Live Safaricom Daraja M-Pesa integration.
- [ ] Real SMS notifications through an SMS gateway.
- [ ] Multi-store and multi-branch management.
- [ ] Cloud-based data synchronization.
- [ ] Advanced inventory forecasting.
- [ ] Supplier and purchase-order management.
- [ ] Advanced business intelligence and reporting.
- [ ] Docker containerization.
- [ ] AWS cloud deployment.

---

## Who Can Benefit From OmniPOS?

OmniPOS demonstrates workflows relevant to:

- Retail shops and small businesses.
- Supermarkets and convenience stores.
- Inventory-focused businesses.
- Retail technology startups.
- Business owners exploring digital retail solutions.
- Developers interested in POS and inventory applications.

Its current implementation is a frontend demonstration, not a certified or production-ready retail transaction system.

---

## Contributing

Contributions, ideas, feedback, and improvements are welcome.

To contribute:

1. Fork this repository.
2. Create a feature branch.
3. Implement your changes.
4. Commit your improvements.
5. Submit a Pull Request.

```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "Add your feature"
git push origin feature/your-feature-name
```

---

## Author

**Stephen Oyugi**

Frontend Developer | AI Automation Engineer | Machine Learning Enthusiast

- GitHub: [@Regalson001](https://github.com/Regalson001)
- LinkedIn: [Stephen Oyugi](https://linkedin.com/in/stephenoyugi001)

---

## License

This project is available under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>OmniPOS — One platform. Every sale. Complete control.</strong>
</p>

<p align="center">
  Built to make modern retail operations smarter, simpler, and more efficient.
</p>
