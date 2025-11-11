// modules
import express from "express";
import cors from "cors";
import connection from "./config/database.config.js";
import dotenv from "dotenv";
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
import anayticsRouter from "./routes/analytics.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import shippingfeeRouter from "./routes/shippingfee.routes.js";
import authRouter from "./routes/auth.routes.js";

// Configuration
dotenv.config();
const PORT = process.env.PORT;

// Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/currency", currencyRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/order", orderRouter);
app.use("/api/orderedItems", orderedItemsRouter);
app.use("/api/message", messageRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/analytics", anayticsRouter);
app.use("/api/shipping", shippingRoutes);
app.use("/api/shippingFee", shippingfeeRouter);
app.use("/api/auth", authRouter);

// Successful connection message on get request to root
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Surver is up ✅",
  });
});

// Start the server if the environment variable START_APP is set to true
if (process.env.START_APP === "true") {
  // ✅ Test DB Connection
  const testConnection = async () => {
    let signal;
    try {
      signal = await connection.getConnection();
      console.log("✅ MySQL connected via pool!");
      return true;
    } catch (err) {
      console.error("❌ MySQL error:", err);
      return false;
    } finally {
      if (signal) signal.release();
    }
  };

  // ✅ Start the server
  const startServer = async () => {
    console.log(" Testing database connection...");
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error("Failed to connect to database. Exiting...");
      process.exit(1); //Kills the app if database fails
    }
    //Start Listening
    const server = app.listen(PORT, () => {
      console.log(`🟢 Listening on https://backend.olisknitwear.com/${PORT}`);
    });

    // Handle server startup errors
    server.on("error", (err) => {
      console.error("Server startup error:", err.message);
      process.exit(1);
    });
  };
  // Start everything
  startServer();
} else {
  console.log("Missing envirometal variable START_APP");
}
