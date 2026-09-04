# 🛒 MERN Stack E-Commerce Mini Project

A full-stack e-commerce application built with **MongoDB, Express, React, Node.js**.

Backend follows a clean **Model – Controller – Router** architecture.

---

## 📁 Project Structure

```
mern-ecommerce/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema (with password hashing)
│   │   ├── Product.js             # Product schema (with reviews)
│   │   └── Order.js               # Order schema
│   ├── controllers/
│   │   ├── authController.js      # Register / Login / Profile logic
│   │   ├── productController.js   # Product CRUD + reviews logic
│   │   └── orderController.js     # Order logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect + admin check
│   │   └── errorMiddleware.js     # 404 + error handler
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── seeder.js                  # Sample data importer
│   ├── server.js                  # App entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/axios.js            # Axios instance (auto attaches JWT)
    │   ├── context/                # AuthContext + CartContext
    │   ├── components/             # Navbar, ProductCard, PrivateRoute
    │   ├── pages/                  # Home, ProductDetails, Cart, Login,
    │   │                           # Register, Checkout, Orders, OrderDetails
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ✅ Prerequisites

Before you start, install:

1. **Node.js** (v18 or higher) → https://nodejs.org
2. **MongoDB Compass** (and MongoDB Community Server running locally)
   → https://www.mongodb.com/try/download/compass
3. A code editor like **VS Code**

Check installations:
```bash
node -v
npm -v
```

---

## 🚀 Step-by-Step Setup Guide

### STEP 1 — Extract the project
Unzip `mern-ecommerce.zip` anywhere on your computer.

### STEP 2 — Start MongoDB & Open Compass
1. Make sure your local MongoDB server is running (installing MongoDB Community Server usually installs this as a service that starts automatically).
2. Open **MongoDB Compass**.
3. Connect using the default connection string:
   ```
   mongodb://127.0.0.1:27017
   ```
4. Once connected, you'll see the database `mern_ecommerce` appear automatically after we run the seeder in Step 4 (Compass creates it once data is inserted).

### STEP 3 — Setup the Backend

Open a terminal in the `backend` folder:

```bash
cd mern-ecommerce/backend
npm install
```

**A working `.env` file is already included in this project** — you do not need
to create or copy anything. It's pre-configured for a local MongoDB instance:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mern_ecommerce
JWT_SECRET=this_is_a_super_secret_key_change_it
JWT_EXPIRES_IN=7d
```

Just open `backend/.env` in a text editor to confirm it's there and looks like
the above. (A `.env.example` file is also included purely as a reference/backup
template — you don't need to copy it.)

> If you're using MongoDB Atlas (cloud) instead of local, open `.env` and replace
> `MONGO_URI` with your Atlas connection string from the Atlas dashboard.

> **If you ever see `MONGO_URI is not set` or a mongoose "undefined" crash:** it
> means the `.env` file is missing or was saved with the wrong name/encoding
> (common on Windows). The server now prints the exact expected file path and a
> clear message when this happens — recreate `.env` at that path with the 5
> lines above, saved as plain text (UTF-8, no BOM).

### STEP 4 — Seed Sample Data (optional but recommended)

This creates 2 users (1 admin) and **20 sample products** across 5 categories
(Electronics, Footwear, Fashion, Accessories, Home & Kitchen) — each with a real
product photo, an INR price, a strikethrough MRP with an auto-calculated discount
badge, star ratings, and review counts — so the storefront looks populated from
the first run.

```bash
npm run seed
```

You should see:
```
✅ Data Imported Successfully!
```

Refresh MongoDB Compass → you'll now see the `mern_ecommerce` database with
`users` and `products` collections populated.

Demo login credentials created by the seeder:
- **Admin:** admin@example.com / 123456
- **Buyer:** john@example.com / 123456
- **Seller (TechNest Store — Electronics):** seller1@example.com / 123456
- **Seller (Urban Threads — Footwear/Fashion/Accessories):** seller2@example.com / 123456

To wipe the sample data later: `npm run seed:destroy`

### STEP 5 — Run the Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: 127.0.0.1/mern_ecommerce
🚀 Server running in development mode on port 5000
```

Test it works by visiting **http://localhost:5000** in your browser — you should see `API is running...`.

Keep this terminal running.

### STEP 6 — Setup & Run the Frontend

Open a **new terminal window** (keep backend running):

```bash
cd mern-ecommerce/frontend
npm install
npm run dev
```

You should see something like:
```
VITE ready
➜  Local:   http://localhost:3000/
```

Open **http://localhost:3000** in your browser. 🎉

The frontend automatically proxies `/api` requests to the backend on port 5000
(configured in `vite.config.js`), so no extra CORS setup is needed during development.

---

## 🧪 How to Test the App

1. Go to `http://localhost:3000` — you'll see the product listing (from the seeder).
2. Click a product → View details → Add to Cart.
3. Go to Cart → Proceed to Checkout (you'll be asked to log in first).
4. Register a new account, or log in with the demo user (`john@example.com` / `123456`).
5. Fill in shipping info → Place Order.
6. View your order under **My Orders**.
7. Log in as **admin@example.com** to explore admin-only API routes (e.g. creating/editing products via Postman, since the mini-project's UI focuses on the customer flow).

---

## 🔌 API Endpoints Reference

### Auth Routes — `/api/auth`
| Method | Endpoint         | Access  | Description          |
|--------|------------------|---------|----------------------|
| POST   | /register        | Public  | Register new user    |
| POST   | /login           | Public  | Login & get JWT      |
| GET    | /profile         | Private | Get logged-in user   |

### Product Routes — `/api/products`
| Method | Endpoint              | Access        | Description               |
|--------|------------------------|--------------|----------------------------|
| GET    | /                      | Public        | Get all products (search, pagination) |
| GET    | /:id                   | Public        | Get single product         |
| POST   | /                      | Admin         | Create product             |
| PUT    | /:id                   | Admin         | Update product              |
| DELETE | /:id                   | Admin         | Delete product              |
| POST   | /:id/reviews           | Private       | Add product review          |

### Order Routes — `/api/orders`
| Method | Endpoint          | Access  | Description                |
|--------|--------------------|---------|-----------------------------|
| POST   | /                  | Private | Create new order            |
| GET    | /myorders          | Private | Get logged-in user's orders |
| GET    | /:id               | Private | Get order by ID             |
| PUT    | /:id/pay           | Private | Mark order as paid          |
| PUT    | /:id/deliver       | Admin   | Mark order as delivered     |
| GET    | /                  | Admin   | Get all orders              |

All **Private/Admin** routes require the header:
```
Authorization: Bearer <your_jwt_token>
```
(The frontend handles this automatically once you're logged in.)

---

## ☁️ Deploying to the Internet (Free Tier)

This project is ready to deploy with **zero code changes needed beyond
environment variables**. The recommended free stack:

| Piece | Service | Why |
|---|---|---|
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) | Free 512MB cluster, works from anywhere |
| Backend API | [Render](https://render.com) | Free Node.js web service |
| Frontend | [Vercel](https://vercel.com) | Free static hosting, built for Vite/React |

### Part A — Create a free MongoDB Atlas cluster

1. Sign up at Atlas and create a **free M0 cluster**.
2. Under **Database Access**, create a database user with a username/password.
3. Under **Network Access**, click **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`) — required so Render can reach it.
4. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mern_ecommerce?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with the database user you created, and make sure the database name (`mern_ecommerce`) is in the path as shown.

### Part B — Deploy the Backend to Render

1. Push this project to a **GitHub repository** (Render deploys from Git).
2. Go to Render → **New** → **Web Service** → connect your repo.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add these **Environment Variables** in Render's dashboard (do NOT upload your `.env` file — set these directly in Render instead):
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<your Atlas connection string from Part A>
   JWT_SECRET=<generate a long random string>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=<your Vercel frontend URL, added after Part C>
   ```
5. Deploy. Once live, note your backend URL, e.g. `https://mern-ecommerce-backend.onrender.com`.
6. Test it: visiting that URL in a browser should show `API is running...`.
7. (Optional but recommended) SSH isn't available on the free tier, so to seed data on the hosted database, run the seeder **locally** pointed at your Atlas URI:
   ```bash
   cd backend
   # temporarily set MONGO_URI in your local .env to the Atlas string
   npm run seed
   ```

### Part C — Deploy the Frontend to Vercel

1. Go to Vercel → **Add New Project** → import the same GitHub repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add this **Environment Variable**:
   ```
   VITE_API_URL=https://mern-ecommerce-backend.onrender.com/api
   ```
   (use your actual Render backend URL from Part B, with `/api` appended)
4. Deploy. You'll get a URL like `https://mern-ecommerce.vercel.app`.

### Part D — Connect the two

1. Go back to Render → your backend service → Environment → set:
   ```
   CLIENT_URL=https://mern-ecommerce.vercel.app
   ```
   (your actual Vercel URL from Part C) — this restricts CORS to your real frontend.
2. Render will auto-redeploy. Once done, open your Vercel URL — the full app should now work live, talking to your hosted backend and Atlas database.

> **Free tier note:** Render's free web services spin down after ~15 minutes of
> inactivity and take 30–60 seconds to wake up on the next request. This is
> normal for a free demo deployment — for an always-on backend, upgrade to a
> paid Render plan or use another host like Railway/Fly.io.



| Problem | Solution |
|---|---|
| `MongoServerError: connect ECONNREFUSED` | Make sure MongoDB service is running locally, or check your Atlas URI/network access. |
| Frontend shows network error on API calls | Make sure backend is running on port 5000 **before** starting frontend. |
| `Port 5000 already in use` | Change `PORT` in `.env`, and update `vite.config.js` proxy target to match. |
| Login/Register fails silently | Open browser dev tools → Network tab → check the error message returned from the API. |
| Products list is empty | Run `npm run seed` inside the backend folder. |
| Deployed frontend can't reach backend (network error) | Check `VITE_API_URL` is set correctly in Vercel and includes `/api` at the end, then redeploy. |
| CORS error in browser console on deployed site | Make sure `CLIENT_URL` in Render exactly matches your Vercel URL (including `https://`, no trailing slash). |
| Render backend works but Atlas connection fails | Confirm Atlas Network Access allows `0.0.0.0/0`, and that the password in `MONGO_URI` has no unencoded special characters (URL-encode `@`, `#`, etc. if your password contains them). |

---

## 📦 Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose ODM), viewed/managed with MongoDB Compass
- **Auth:** JSON Web Tokens (JWT) + bcrypt password hashing

---

## 📌 Notes

- This is a **mini/learning project** — payment gateways (Stripe/PayPal) are simulated
  with a "Mark As Paid" demo button rather than integrated live.
- Product images use placeholder paths (`/images/...`); replace with real image URLs
  or host images in `frontend/public/images/` for a polished look.
- For production, always change `JWT_SECRET` and never commit your real `.env` file.

Enjoy building on top of this! 🚀
