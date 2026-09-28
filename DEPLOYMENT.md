# 🚀 Complete Deployment Guide: MERN E-Commerce App

This guide walks you through deploying your full-stack MERN application with:
- **Backend API**: Render or Railway (Node.js/Express)
- **Database**: MongoDB Atlas (Free Cloud Database)
- **Frontend App**: Vercel (Vite + React)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Shared Cluster (M0)**.
3. Under **Database Access**, create a database user (e.g. `dbuser`) and set a strong password.
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** so your hosted backend can connect.
5. Click **Connect** -> **Drivers** -> Copy your connection string:
   ```text
   mongodb+srv://dbuser:<password>@cluster0.xxx.mongodb.net/ecommerce_db?retryWrites=true&w=majority
   ```

---

## ⚙️ Step 2: Deploy Backend to Render

1. Push your repository to **GitHub**.
2. Log in to [Render](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `mern-ecommerce-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add **Environment Variables** under the *Environment* tab:
   | Key | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGO_URI` | *Your MongoDB Atlas connection string from Step 1* |
   | `JWT_SECRET` | *A random secret string (e.g., `supersecretkey123`)* |
6. Click **Create Web Service**. Once deployed, copy your live backend URL (e.g., `https://mern-ecommerce-api.onrender.com`).

---

## 💻 Step 3: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. In the project setup screen:
   - Set **Root Directory** to `frontend`.
   - Build & Output Settings will auto-detect **Vite**.
4. Expand **Environment Variables** and add:
   | Name | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://mern-ecommerce-api.onrender.com` *(Your Render backend URL)* |
5. Click **Deploy**.

---

## ⚡ Seed Initial Products to Cloud Database (Optional)

To seed initial categories, products, and admin accounts into your cloud database:
1. Open terminal on your local machine.
2. Open `backend/.env` and temporarily replace `MONGO_URI` with your MongoDB Atlas string.
3. Run the seed script:
   ```bash
   cd backend
   npm run seed
   ```
4. Restore `backend/.env` back to local URI if testing locally.

---

## 🎉 Done!
Your full-stack application is live:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://mern-ecommerce-api.onrender.com/api/products`
