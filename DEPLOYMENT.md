# 🌐 Internet Deployment Guide (Vercel + Render + MongoDB Atlas)

Follow this guide to deploy your MERN Stack E-Commerce app to the internet so anyone can access it!

---

## 1️⃣ Database: Setup MongoDB Atlas (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create a Database** -> Select **M0 Free Cluster**.
3. Under **Database Access**, create a database user (e.g., `admin` / `password123`).
4. Under **Network Access**, click **Add IP Address** -> Select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** -> Choose **Drivers** and copy your Connection String:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/ecommerce_db?retryWrites=true&w=majority
   ```

---

## 2️⃣ Backend: Deploy to Render.com (Free Node.js Hosting)
1. Push your code to a GitHub repository.
2. Sign up on [Render.com](https://render.com).
3. Click **New +** -> **Web Service** -> Connect your GitHub Repository.
4. Set the following details:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add **Environment Variables** under Render Settings:
   - `PORT`: `5000`
   - `MONGO_URI`: *(Your MongoDB Atlas connection string from Step 1)*
   - `JWT_SECRET`: `your_super_secret_jwt_key_2026`
6. Click **Deploy Web Service**. Render will provide your backend URL:
   `https://your-app-backend.onrender.com`

---

## 3️⃣ Frontend: Deploy to Vercel (Free React Hosting)
1. Sign up on [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project** -> Import your GitHub Repository.
3. Set the following details:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Add **Environment Variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-app-backend.onrender.com/api` *(Your Render Backend URL)*
5. Click **Deploy**. Vercel will build your site and generate a live URL:
   `https://your-app-frontend.vercel.app`

---

## ⚡ Solution to Prevent Blank Screen on Live Site:
1. Ensure `VITE_API_URL` on Vercel ends with `/api` and points to your HTTPS backend.
2. Ensure MongoDB Atlas IP Whitelist has `0.0.0.0/0` enabled so Render can access your DB.
