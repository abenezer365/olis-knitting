import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

import env from "./config/env.js";
import pool from "./config/database.config.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

// Routes
import userRouter from "./routes/user.routes.js";
import customerRouter from "./routes/customers.routes.js";
import currencyRouter from "./routes/currency.routes.js";
import productRouter from "./routes/products.routes.js";
import categoryRouter from "./routes/category.routes.js";
import orderRouter from "./routes/order.routes.js";
import orderedItemsRouter from "./routes/orderedItems.routes.js";
import messageRouter from "./routes/messages.routes.js";
import revenueRouter from "./routes/revenue.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import shippingfeeRouter from "./routes/shippingfee.routes.js";
import authRouter from "./routes/auth.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", 1); // correct client IPs behind a reverse proxy (rate limiting)

// Security & performance middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());

// CORS: restrict to configured origins; an empty list allows all (dev convenience).
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || env.corsOrigins.length === 0 || env.corsOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Legacy local images (new uploads go to Cloudinary).
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Health checks (kept outside the rate limiter so probes never get throttled).
app.get("/", (req, res) => res.status(200).json({ status: "Success", message: "Server is up ✅" }));
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", db: "connected" });
  } catch {
    res.status(503).json({ status: "degraded", db: "unavailable" });
  }
});

// API routes (rate limited)
app.use("/api", apiLimiter);
app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/currency", currencyRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/order", orderRouter);
app.use("/api/orderedItems", orderedItemsRouter);
app.use("/api/message", messageRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/shipping", shippingRoutes);
app.use("/api/shippingFee", shippingfeeRouter);
app.use("/api/auth", authRouter);

app.use(notFound);
app.use(errorHandler);

// ---- Startup & graceful shutdown ----
const startServer = async () => {
  try {
    const conn = await pool.getConnection();
    conn.release();
    console.log("✅ MySQL connected via pool");
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    console.log(`🟢 API listening on port ${env.port} (${env.nodeEnv})`);
  });

  server.on("error", (err) => {
    console.error("Server startup error:", err.message);
    process.exit(1);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await pool.end().catch(() => {});
      console.log("Closed server and DB pool. Bye 👋");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();

export default app;
