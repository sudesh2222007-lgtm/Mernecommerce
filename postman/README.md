# Postman Collection — MERN E-Commerce API

## Files
- `MERN-Ecommerce.postman_collection.json` — all 18 API requests, organized into Auth / Products / Orders folders
- `MERN-Ecommerce.postman_environment.json` — variables (`baseUrl`, `token`, `adminToken`, etc.)

## How to Import

1. Open Postman.
2. Click **Import** (top left).
3. Drag in both files, or select them individually.
4. In the top-right environment dropdown, select **"MERN E-Commerce - Local"**.

## Before You Start

Make sure your backend is running (`npm run dev` inside `backend/`) and you've
seeded sample data (`npm run seed`) — this gives you the demo accounts:

- **Admin:** admin@example.com / 123456
- **User:** john@example.com / 123456

## Recommended Order to Run Requests

1. **Auth → Login (User)** — automatically saves `{{token}}` for all user-level requests.
2. **Auth → Login (Admin)** — automatically saves `{{adminToken}}` for admin-only requests.
3. **Products → Get All Products** — automatically saves `{{productId}}` (first product in the list) so you don't have to copy/paste IDs.
4. Now every other request (reviews, orders, admin product edits) will work out of the box, since they reference `{{token}}`, `{{adminToken}}`, and `{{productId}}`.
5. **Orders → Create Order** automatically saves `{{orderId}}` — used by "Get Order By ID", "Mark Order Paid", etc.

## Notes

- Requests marked "(Admin)" in the collection use `{{adminToken}}` — you must run **Login (Admin)** first or they'll return `403 Not authorized as an admin`.
- If you get `401 Not authorized, no token`, it means the relevant login request hasn't been run yet in this environment, or the token expired (default expiry: 7 days, set by `JWT_EXPIRES_IN` in `.env`).
- `baseUrl` defaults to `http://localhost:5000`. Change it in the environment if your backend runs on a different port.
