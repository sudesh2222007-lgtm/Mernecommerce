# AURA - Full-Stack MERN E-Commerce Application 🚀

A modern, high-performance, responsive E-Commerce web application built using the **MERN** stack (MongoDB, Express.js, React, Node.js) with JWT Authentication, MongoDB Compass database integration, Order tracking, and Admin panel dashboard.

---

## 📁 Project Architecture & Folder Structure

```
web/
├── backend/
│   ├── config/
│   │   └── db.js            # Mongoose MongoDB Connection
│   ├── controllers/
│   │   ├── authController.js    # Register, Login, User Profile logic
│   │   ├── productController.js # Get, Search, Create & Delete Products
│   │   └── orderController.js   # Order Checkout, History & Admin Status updates
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT token verification & Admin check
│   │   └── errorHandler.js      # Express Error Handler
│   ├── models/
│   │   ├── User.js          # User Mongoose Schema + Bcrypt Hashing
│   │   ├── Product.js       # Product Mongoose Schema
│   │   └── Order.js         # Order Mongoose Schema
│   ├── routes/
│   │   ├── authRoutes.js    # Auth Endpoints (/api/auth)
│   │   ├── productRoutes.js # Product Endpoints (/api/products)
│   │   └── orderRoutes.js   # Order Endpoints (/api/orders)
│   ├── .env                 # Environment Variables (Port, DB URI, JWT Secret)
│   ├── seed.js              # Database Populator Script
│   ├── server.js            # Express Entry Point Server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Glassmorphic UI Components (Navbar, Cards, Modals, Admin)
│   │   ├── services/
│   │   │   └── api.js       # API Client Service
│   │   ├── App.jsx          # Root React App Component
│   │   ├── index.css        # Modern Design System & Variables
│   │   └── main.jsx         # React Entry Point
│   ├── index.html           # Main HTML Shell
│   ├── vite.config.js       # Vite + Proxy Config
│   └── package.json
└── README.md
```

---

## 🛠️ Step-by-Step Setup Guide

### 1️⃣ Prerequisites
- **Node.js** (v16.0 or higher): [Download Node.js](https://nodejs.org/)
- **MongoDB Compass** installed locally: [Download MongoDB Compass](https://www.mongodb.com/products/tools/compass)

---

### 2️⃣ Step 1: Start MongoDB Compass
1. Open **MongoDB Compass**.
2. Click **Connect** with default URI:
   ```
   mongodb://localhost:27017
   ```
3. Once connected, your database `ecommerce_db` will be created automatically when backend or seed script runs.

---

### 3️⃣ Step 2: Install & Start Backend (Node.js & Express)

1. Open terminal inside `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Seed Database with Sample Data & Accounts**:
   ```bash
   npm run seed
   ```
   *(This populates electronics, fashion, and home products into MongoDB Compass along with Demo Admin and Customer accounts)*

4. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   - Server runs on **`http://localhost:5000`**
   - API Health check: **`http://localhost:5000/api/health`**

---

### 4️⃣ Step 3: Install & Start Frontend (React + Vite)

1. Open a new terminal inside `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Start the Frontend Dev Server**:
   ```bash
   npm run dev
   ```
4. Open your web browser and go to:
   ```
   http://localhost:3000
   ```

---

## 🔑 Demo Account Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@example.com` | `adminpassword123` |
| 👤 **Customer** | `customer@example.com` | `customerpassword123` |

*(You can also register a new account anytime directly from the Sign In modal on the website)*

---

## ✨ Features Included

- 🛒 **Interactive Shopping Cart**: Add items, update quantities, remove items, calculate real-time subtotal & taxes.
- 🔍 **Live Search & Category Filtering**: Filter by Electronics, Fashion, Home & Living or search by keyword.
- 💳 **Seamless Checkout Flow**: Input shipping details, select payment methods, and place orders.
- 📦 **Order Tracking**: Logged-in users can view order history and delivery statuses.
- 🛡️ **Admin Portal Dashboard**: Admins can add new products, delete items, and update customer order statuses (Processing, Shipped, Delivered).
