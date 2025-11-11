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

    res.status(200).json({
      success: true,
      message: "Analytics data fetched successfully",
      analytics: rows[0],
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching analytics",
    });
  }
};

// 🧮 POST /analytics — Calculate & insert new analytics snapshot
export const updateAnalytics = async (req, res) => {
  try {
    // 1️⃣ Fetch total counts from related tables
    const [[{ totalRevenue }]] = await connection.execute(`
      SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue FROM orders WHERE payment_status = 'paid'
    `);
    const [[{ totalOrders }]] = await connection.execute(`
      SELECT COUNT(*) AS totalOrders FROM orders WHERE payment_status = 'paid'
    `);
    const [[{ totalProducts }]] = await connection.execute(`
      SELECT COUNT(*) AS totalProducts FROM products
    `);
    const [[{ totalCustomers }]] = await connection.execute(`
      SELECT COUNT(*) AS totalCustomers FROM customers
    `);

    // 2️⃣ Build sales data — most sold products
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

    // 3️⃣ Build revenue data — total revenue per product category
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

    // 4️⃣ Insert into analytics table
    const [result] = await connection.execute(
      `
      INSERT INTO analytics 
        (uuid, total_revenue, total_orders, total_products, total_customers, sales_data, revenue_data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        uuid(),
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        JSON.stringify(salesDataRows),
        JSON.stringify(revenueDataRows),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Analytics data updated successfully",
      insertedId: result.insertId,
      analytics: {
        totalRevenue,
        totalOrders,
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
