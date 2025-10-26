import { v4 as uuidv4 } from "uuid";
import connection from "../config/database.config.js"

// Calculate and store revenue data
export async function updateRevenue(req, res) {
  try {
    const now = new Date();

    // Total Revenue (paid only)
    const [totalRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS total_revenue 
      FROM orders WHERE payment_status = 'paid'
    `);
    const total_revenue = totalRows[0].total_revenue;

    // Current Month Revenue
    const [monthRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS month_revenue 
      FROM orders 
      WHERE payment_status = 'paid'
      AND MONTH(order_date) = MONTH(?) 
      AND YEAR(order_date) = YEAR(?)
    `, [now, now]);
    const month_revenue = monthRows[0].month_revenue;

    // Previous Month Revenue
    const [prevRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS previous_month_revenue 
      FROM orders 
      WHERE payment_status = 'paid'
      AND MONTH(order_date) = MONTH(DATE_SUB(?, INTERVAL 1 MONTH)) 
      AND YEAR(order_date) = YEAR(DATE_SUB(?, INTERVAL 1 MONTH))
    `, [now, now]);
    const previous_month_revenue = prevRows[0].previous_month_revenue;

    // Weekly Revenue (last 7 days)
    const [weekRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS week_revenue 
      FROM orders 
      WHERE payment_status = 'paid'
      AND order_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const week_revenue = weekRows[0].week_revenue;

    // Daily Revenue (today)
    const [dayRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS daily_revenue 
      FROM orders 
      WHERE payment_status = 'paid'
      AND DATE(order_date) = CURDATE()
    `);
    const daily_revenue = dayRows[0].daily_revenue;

// Last 6 Months Trend
  const [trendRows] = await connection.execute(`
    SELECT 
      DATE_FORMAT(order_date, '%b %Y') AS month, 
      SUM(total_amount) AS revenue
    FROM orders
    WHERE payment_status = 'paid'
    AND order_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(order_date, '%b %Y')
    ORDER BY MIN(order_date)
  `);


    const monthly_trend = {};
    trendRows.forEach(row => monthly_trend[row.month] = row.revenue);

    // Insert new revenue record
    const uuid = uuidv4();
    await connection.execute(`
      INSERT INTO revenue (
        uuid, total_revenue, month_revenue, previous_month_revenue,
        week_revenue, daily_revenue, monthly_trend
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [uuid, total_revenue, month_revenue, previous_month_revenue,
        week_revenue, daily_revenue, JSON.stringify(monthly_trend)]);

    res.status(201).json({
      message: "Revenue calculated and stored successfully",
      data: {
        uuid,
        total_revenue,
        month_revenue,
        previous_month_revenue,
        week_revenue,
        daily_revenue,
        monthly_trend
      }
    });

  } catch (error) {
    console.error("Error updating revenue:", error);
    res.status(500).json({ message: "Failed to update revenue" });
  }
};

// Fetch the latest revenue info
export async function getRevenue(req, res) {
  try {
    const [rows] = await connection.execute(`
      SELECT * FROM revenue ORDER BY recorded_at DESC LIMIT 1
    `);

    if (!rows.length)
      return res.status(404).json({ message: "No revenue data found" });

    const data = rows[0];

    // Safely handle JSON parsing
    if (typeof data.monthly_trend === "string") {
      try {
        data.monthly_trend = JSON.parse(data.monthly_trend);
      } catch {
        data.monthly_trend = {};
      }
    } else if (typeof data.monthly_trend !== "object" || data.monthly_trend === null) {
      data.monthly_trend = {};
    }

    res.status(200).json({
      message: "Revenue fetched successfully",
      data
    });

  } catch (error) {
    console.error("Error fetching revenue:", error);
    res.status(500).json({ message: "Failed to fetch revenue" });
  }
}
