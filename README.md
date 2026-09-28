# 🛍️ Modern MERN Stack E-Commerce Full Application

A complete, production-grade E-Commerce Web Application built using **MongoDB, Express.js, React, and Node.js (MERN Stack)** with clean **MVC (Models, Controllers, Routes)** architecture, JWT authentication, stock management, order tracking, admin portal, and MongoDB Compass integration.

---

## 📁 Project Architecture & Directory Structure

```text
web/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose MongoDB Compass Connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile logic
│   │   ├── productController.js  # Product CRUD, category list & search
│   │   └── orderController.js    # Order checkout, status updates, admin listing
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection & Admin guard
│   │   └── errorHandler.js       # Express global error & 404 handler
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   ├── Product.js            # Product schema with inventory & ratings
│   │   └── Order.js              # Order schema with shipping & items
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── productRoutes.js      # /api/products endpoints
│   │   └── orderRoutes.js        # /api/orders endpoints
│   ├── .env                      # Environment config (Port, Mongo URI, JWT Secret)
│   ├── package.json              # Backend dependencies
│   ├── seed.js                   # One-command database seeder
│   └── server.js                 # Main Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx    # Admin dashboard (Add/delete product, update order)
│   │   │   ├── AuthModal.jsx     # User Sign In / Register dialog
│   │   │   ├── CartDrawer.jsx    # Sliding shopping cart panel
│   │   │   ├── CheckoutModal.jsx # Multi-step checkout & payment window
│   │   │   ├── Hero.jsx          # Hero section with selling points
│   │   │   ├── MyOrdersModal.jsx # Order history tracking modal
│   │   │   ├── Navbar.jsx        # Navigation bar with live search & cart counter
│   │   │   ├── ProductCard.jsx   # Product card component with quick view
│   │   │   ├── ProductModal.jsx  # Full details quick view modal
│   │   │   └── ToastNotification.jsx # Animated notification toast
│   │   ├── services/
│   │   │   └── api.js            # API client service communicating with backend
│   │   ├── App.jsx               # Main React Application container
│   │   ├── index.css             # Design tokens, glassmorphism & dark theme styles
│   │   └── main.jsx              # React DOM entry
│   ├── index.html                # Main HTML wrapper
│   ├── package.json              # Frontend Vite dependencies
│   └── vite.config.js            # Vite configuration with API proxying
└── README.md                     # Step-by-step setup documentation
```

---

## 🚀 Step-by-Step Guide to Run the Project

### Prerequisites
Make sure you have the following installed on your machine:
1. **Node.js** (v16+ recommended): [Download Node.js](https://nodejs.org/)
2. **MongoDB Community Server** or **MongoDB Compass**: [Download MongoDB Compass](https://www.mongodb.com/try/download/compass)

---

### Step 1: Start MongoDB Service / Compass
1. Ensure your local MongoDB server is running on `mongodb://localhost:27017`.
2. Open **MongoDB Compass**.
3. In the connection bar, enter:
   ```text
   mongodb://localhost:27017
   ```
4. Click **Connect**. (Database `ecommerce_db` will automatically show up after running the seed script).

---

### Step 2: Install Backend Dependencies & Seed Database

1. Open PowerShell or Terminal and navigate to the `backend` folder:
   ```bash
   cd "c:\Users\SUDESH S\OneDrive\Desktop\web\backend"
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. **Seed Database** with sample products, categories, admin user, and customer account:
   ```bash
   npm run seed
   ```
   *Output should show:*
   > `[MongoDB Connected]: localhost`
   > `Created Users: Admin Account: admin@example.com / adminpassword123`
   > `Successfully seeded 8 products!`

---

### Step 3: Run the Backend Server

Start the Node.js Express server in development mode:
```bash
npm run dev
```
- The backend server runs at: `http://localhost:5000`
- API Health Check endpoint: `http://localhost:5000/`

---

### Step 4: Install & Run Frontend (React + Vite)

1. Open a **new terminal tab/window** and navigate to the `frontend` folder:
   ```bash
   cd "c:\Users\SUDESH S\OneDrive\Desktop\web\frontend"
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to:
   ```text
   http://localhost:5173
   ```

---

## 🔑 Pre-Configured Test Credentials

For quick testing, use the **one-click demo login buttons** inside the Sign In modal:

| User Type | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Customer** | `user@example.com` | `userpassword123` | Cart, Checkout, Order History |
| **Admin** | `admin@example.com` | `adminpassword123` | Inventory CRUD, Add Products, Manage Order Status |

---

## 🔌 API Endpoints Reference

### Auth Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/profile` — Get logged-in user profile (Protected)

### Product Endpoints (`/api/products`)
- `GET /api/products` — Get all products (Supports `?keyword=...` and `?category=...`)
- `GET /api/products/:id` — Get single product by ID
- `GET /api/products/categories/list` — Get unique categories list
- `POST /api/products` — Create new product (Admin required)
- `DELETE /api/products/:id` — Delete product (Admin required)

### Order Endpoints (`/api/orders`)
- `POST /api/orders` — Create new order (Protected)
- `GET /api/orders/myorders` — Get user order history (Protected)
- `GET /api/orders` — Get all orders across platform (Admin required)
- `PUT /api/orders/:id/status` — Update order status (Admin required)

---

## 🎨 Features & Technologies Used
- **Frontend**: React 18, Vite, Lucide Icons, Glassmorphism CSS design system.
- **Backend**: Node.js, Express.js, Mongoose ODM.
- **Database**: MongoDB (Local Compass compatible `ecommerce_db`).
- **Security**: JWT authentication, bcryptjs password hashing.
