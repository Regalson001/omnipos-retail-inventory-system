A modern retail Point of Sale (POS), inventory management and customer credit management application.

Built with HTML5, modern CSS3 and modular Vanilla JavaScript ES6+.

## Repository

omnipos-retail-inventory-system

## Technology Stack

- HTML5
- CSS3
- JavaScript ES6+
- LocalStorage API
- BroadcastChannel API
- SVG
- HTML Canvas API

## Core Features

### 1. Point of Sale

- Product catalogue.
- Product search.
- SKU and barcode simulation.
- Category filters.
- Shopping cart.
- Quantity management.
- Discounts.
- VAT calculations.
- Cash, M-Pesa simulation and card payment options.
- Printable receipts.
- Automatic stock deduction.

### 2. M-Pesa Payment Feed

- Incoming Paybill and Till transaction simulation.
- Customer name and phone number.
- Transaction codes.
- Payment amount.
- Payment timestamp.
- Account number.
- BroadcastChannel communication.
- Custom browser payment events.
- Payment matching.

### 3. Customer Credit Management

- Customer registration.
- Customer phone numbers.
- Credit limits.
- Outstanding balances.
- Repayment due dates.
- Customer transaction history.
- Full and partial repayments.
- Unpaid debt purchase restrictions.

### 4. SMS Notification Centre

- Credit purchase SMS previews.
- Outstanding debt reminders.
- Repayment confirmations.
- SMS audit logs.

### 5. Inventory Management

- Product catalogue.
- Cost and selling prices.
- Stock quantities.
- Restocking.
- SKU management.
- Batch numbers.
- Expiry warnings.
- Low stock alerts.

### 6. Analytics

- Revenue.
- Cost of goods sold.
- Gross profit.
- Gross margin.
- Outstanding debt.
- Transactions.
- Payment breakdown.
- Sales CSV export.

### 7. Application Infrastructure

- LocalStorage persistence.
- Online/offline mode.
- Offline change queue.
- Responsive layouts.
- Dark/light appearance.

## Project Structure

omnipos-retail-inventory-system/

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
├── index.html
├── README.md
└── .gitignore

## Installation

Clone the repository:

git clone https://github.com/Regalson001/omnipos-retail-inventory-system.git

Navigate into the project:

cd omnipos-retail-inventory-system

## Run the application

Using Python:

python -m http.server 8000

Open:

http://localhost:8000

Alternatively, use the VS Code Live Server extension.

## Demo Data

The application includes sample products and customer accounts.

All demo application state is stored in browser LocalStorage.

## M-Pesa Integration

The current implementation simulates incoming M-Pesa transactions.

A production integration requires:

- Safaricom Daraja API.
- Secure backend webhook endpoint.
- Callback verification.
- Transaction validation.
- Duplicate transaction protection.
- Authenticated POS event delivery.

Never expose M-Pesa API secrets in frontend JavaScript.

## SMS Integration

SMS notifications are generated as previews and saved in the SMS log.

Real SMS delivery requires a server-side SMS gateway integration.

## Production Roadmap

- Python FastAPI backend.
- PostgreSQL database.
- Safaricom Daraja integration.
- Real SMS gateway.
- User authentication.
- Role-based access control.
- Multi-branch inventory.
- Cloud synchronization.
- Automated reporting.
- Audit logging.

## License

Choose an appropriate license before public distribution.
