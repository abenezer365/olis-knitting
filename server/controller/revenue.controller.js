import { v4 as uuidv4 } from "uuid";
import connection from "../config/database.config.js";

export async function updateRevenue(req, res) {
  try {
    const now = new Date();

    // 🧮 Total revenue (paid only)
    const [totalRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS total_revenue
      FROM orders WHERE payment_status = 'paid'
    `);
    const total_revenue = parseFloat(totalRows[0].total_revenue) || 0;

    // 📅 Current month revenue
    const [monthRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS month_revenue
      FROM orders
      WHERE payment_status = 'paid'
        AND MONTH(order_date) = MONTH(?)
        AND YEAR(order_date) = YEAR(?)
    `, [now, now]);
    const month_revenue = parseFloat(monthRows[0].month_revenue) || 0;

    // ⏮ Previous month revenue
    const [prevRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS previous_month_revenue
      FROM orders
      WHERE payment_status = 'paid'
        AND MONTH(order_date) = MONTH(DATE_SUB(?, INTERVAL 1 MONTH))
        AND YEAR(order_date) = YEAR(DATE_SUB(?, INTERVAL 1 MONTH))
    `, [now, now]);
    const previous_month_revenue = parseFloat(prevRows[0].previous_month_revenue) || 0;

    // 📆 Weekly revenue (last 7 days)
    const [weekRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS week_revenue
      FROM orders
      WHERE payment_status = 'paid'
        AND order_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const week_revenue = parseFloat(weekRows[0].week_revenue) || 0;

    // 📅 Daily revenue (today)
    const [dayRows] = await connection.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS daily_revenue
      FROM orders
      WHERE payment_status = 'paid'
        AND DATE(order_date) = CURDATE()
    `);
    const daily_revenue = parseFloat(dayRows[0].daily_revenue) || 0;

    // 📊 Monthly trend (last 6 months)
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

    // 🧩 Fill in missing months
    const trendMap = {};
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleString("en-US", { month: "short", year: "numeric" });
      months.push(monthKey);
      trendMap[monthKey] = 0;
    }

    trendRows.forEach(row => {
      trendMap[row.month] = parseFloat(row.revenue) || 0;
    });

    const monthly_trend = trendMap;

    // 🪣 Insert new revenue record
    const uuid = uuidv4();
    await connection.execute(`
      INSERT INTO revenue (
        uuid,
        total_revenue,
        month_revenue,
        previous_month_revenue,
        week_revenue,
        daily_revenue,
        monthly_trend
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      uuid,
      total_revenue,
      month_revenue,
      previous_month_revenue,
      week_revenue,
      daily_revenue,
      JSON.stringify(monthly_trend)
    ]);

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
    console.error("❌ Error updating revenue:", error);
    res.status(500).json({ message: "Failed to update revenue" });
  }
}


export async function getRevenue(req, res) {
  try {
    const [rows] = await connection.execute(`
      SELECT * FROM revenue ORDER BY recorded_at DESC LIMIT 1
    `);

    if (!rows.length) {
      return res.status(404).json({ message: "No revenue data found" });
    }

    const data = rows[0];

    // Parse the monthly trend JSON
    try {
      data.monthly_trend =
        typeof data.monthly_trend === "string"
          ? JSON.parse(data.monthly_trend)
          : data.monthly_trend || {};
    } catch {
      data.monthly_trend = {};
    }

    res.status(200).json({
      message: "Revenue fetched successfully",
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching revenue:", error);
    res.status(500).json({ message: "Failed to fetch revenue" });
  }
}
