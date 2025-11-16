import { v4 as uuid } from "uuid";
import connection from "../config/database.config.js";

// 🧾 GET /analytics — Fetch the latest analytics data
export const getAnalytics = async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM analytics ORDER BY recorded_at DESC LIMIT 1"
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No analytics data found",
      });
    }

    const analytics = rows[0];

    // ✅ Parse JSON fields safely (only if they are strings)
    const parseIfString = (data) => {
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return data; // return as-is if parsing fails
        }
      }
      return data; // already object or array
    };

    const formattedAnalytics = {
      ...analytics,
      sales_data: parseIfString(analytics.sales_data),
      revenue_data: parseIfString(analytics.revenue_data),
    };

    res.status(200).json({
      success: true,
      message: "Analytics data fetched successfully",
      analytics: formattedAnalytics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching analytics",
    });
  }
};

// 🧾 UPDATE /analytics — Refresh analytics data
export const updateAnalytics = async (req, res) => {
  try {
    // 1️⃣ Fetch total revenue from paid orders
    const [[{ totalRevenue }]] = await connection.execute(`
      SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue
      FROM orders
      WHERE payment_status = 'paid';
    `);

    // 2️⃣ Fetch total ordered items (sum of quantities from paid orders)
    const [[{ totalOrderedItems }]] = await connection.execute(`
      SELECT IFNULL(SUM(oi.quantity), 0) AS totalOrderedItems
      FROM ordered_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.payment_status = 'paid';
    `);

    // 3️⃣ Count total products
    const [[{ totalProducts }]] = await connection.execute(`
      SELECT COUNT(*) AS totalProducts FROM products;
    `);

    // 4️⃣ Count total customers
    const [[{ totalCustomers }]] = await connection.execute(`
      SELECT COUNT(*) AS totalCustomers FROM customers;
    `);

    // 5️⃣ Build sales data — most sold products
    const [salesDataRows] = await connection.execute(`
      SELECT 
        p.name AS productName,
        SUM(oi.quantity) AS sales
      FROM ordered_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.payment_status = 'paid'
      GROUP BY p.name
      ORDER BY sales DESC
      LIMIT 10;
    `);

    // 6️⃣ Build revenue data — total revenue per product category
    const [revenueDataRows] = await connection.execute(`
      SELECT 
        c.name AS category,
        SUM(oi.quantity * oi.price) AS revenue
      FROM ordered_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      JOIN categories c ON p.category_id = c.id
      WHERE o.payment_status = 'paid'
      GROUP BY c.name
      ORDER BY revenue DESC;
    `);

    // 7️⃣ Insert into analytics table
    const [result] = await connection.execute(
      `
      INSERT INTO analytics 
        (uuid, total_revenue, total_orders, total_products, total_customers, sales_data, revenue_data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        uuid(),
        totalRevenue,
        totalOrderedItems, // ✅ replaced totalOrders with totalOrderedItems
        totalProducts,
        totalCustomers,
        JSON.stringify(salesDataRows),
        JSON.stringify(revenueDataRows),
      ]
    );

    // 8️⃣ Response
    res.status(201).json({
      success: true,
      message: "Analytics data updated successfully",
      insertedId: result.insertId,
      analytics: {
        totalRevenue,
        totalOrderedItems,
        totalProducts,
        totalCustomers,
        salesData: salesDataRows,
        revenueData: revenueDataRows,
      },
    });
  } catch (error) {
    console.error("Error updating analytics:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating analytics",
      error: error.message,
    });
  }
};
