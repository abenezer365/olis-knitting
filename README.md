# Olis Fashion Website

## Introduction
The Olis Fashion Website is a full-featured, modern web platform created for **Olis Knitting & Fashion**, a brand dedicated to high-quality knitwear and fashion products. This website serves as the brand’s digital presence, providing an elegant, user-friendly, and engaging way for customers to explore products, learn about the brand, and place orders.  

Designed with both aesthetics and functionality in mind, the website combines a **beautiful browsing experience** with practical tools that make managing orders and tracking customer interactions seamless. It reflects Olis’ identity through carefully chosen colors, design elements, and an overall style inspired by traditional craftsmanship and storytelling.

---

## Key Features
While the website is simple for users, it integrates several key features that make it professional and practical:  

- **Product Display:** Customers can browse products by category, view detailed product information, and understand what makes each product unique.  
- **Order Placement:** A streamlined system allows customers to place orders, submit necessary information, and receive confirmation.  
- **Order Tracking:** Verified orders are trackable, ensuring customers stay informed about their purchases from verification to delivery.  
- **Notifications:** Both customers and the admin team receive updates and notifications regarding order status.  
- **Brand Identity & Design:** The website reflects Olis’ brand colors, style, and story, giving it a modern yet traditional aesthetic.  
- **Responsive & User-Friendly:** Designed to work beautifully on all devices, ensuring a seamless experience for visitors.  

---

## Value Proposition
The Olis Fashion Website serves as more than just an online catalog. It provides:  

- A professional digital presence for Olis, improving credibility and visibility.  
- A seamless, reliable, and informative shopping experience for customers.  
- Practical management tools for internal staff, enabling efficient order handling and data tracking.  
- A platform that can be expanded in the future for additional features such as e-commerce payments, marketing tools, or content updates.  

By combining style, functionality, and simplicity, the website strengthens the connection between Olis and its customers while enhancing internal operations and efficiency.

---

## Conclusion
The Olis Fashion Website is a thoughtful, elegant, and functional platform that represents the brand online. It ensures that both customers and staff have a smooth, engaging, and professional experience, while reflecting Olis’ dedication to quality, craftsmanship, and storytelling in every aspect of its digital presence.

---

**Project Status:**  
Currently in development, with a demo version available for review and a full version planned for final deployment.

---

## Backend — Local development with Docker

The API and a MySQL database run together via Docker Compose, so the whole team gets an identical environment.

```bash
# 1. Configure environment (fill in secrets: JWT_SECRET, EMAIL, Cloudinary keys)
cp server/.env.example server/.env

# 2. Build & start MySQL + the API
docker compose up --build

# 3. Load demo data (dev only — refuses to run in production)
docker compose exec api npm run seed
```

- API: http://localhost:5000 — health check at `/health`
- Default seeded admin: `admin@olisknitwear.com` / `Admin@12345` (override via `SEED_ADMIN_*`)
- Tables are created automatically on first DB boot from `server/schema/table.sql`.

### Running the API without Docker

```bash
cd server
cp .env.example .env   # point DB_HOST at your MySQL
npm install
npm run seed           # optional demo data
npm run dev            # nodemon, or `npm start`
```

### Production notes

- Set `NODE_ENV=production` and a strong `JWT_SECRET`; the app fails fast if required env vars are missing.
- Point `DB_*` at a managed MySQL instance (don't use the bundled dev DB container).
- Set `CORS_ORIGINS` to your real admin/client domains.
- Product images are stored in **Cloudinary** — configure `CLOUDINARY_*`.

> Frontend (`admin/`, `client/`) still hardcode the API base URL in `src/utils/axios.instance.js`.
> Switching those to an environment variable is the next planned pass.
