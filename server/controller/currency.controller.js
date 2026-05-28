import connection from "../config/database.config.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';
dotenv.config();

export async function getCurrentRate(req, res) {
  try {
    const [rows] = await connection.execute(
      `SELECT current_rate FROM currency_rates ORDER BY change_time DESC LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(404).json({ rate: null });
    }
    const rate = parseFloat(rows[0].current_rate);
    return res.status(200).json({ rate : rate });
  } catch (error) {
    console.error("Get current rate error:", error);
    return res.status(500).json({ rate: null });
  }
}

export async function updateRate(req, res) {
  const { current_rate, reason } = req.body;

  if (!current_rate || isNaN(current_rate)) {
    return res.status(400).json({
      message: "Valid 'current_rate' is required",
      success: false
    });
  }

  const rate = parseFloat(current_rate).toFixed(4);

  try {
    const [prevRows] = await connection.execute(
      `SELECT current_rate FROM currency_rates 
       ORDER BY change_time DESC LIMIT 1`
    );

    const previous_rate = prevRows.length > 0 ? prevRows[0].current_rate : null;
    const uuid = uuidv4();
    await connection.execute(
      `INSERT INTO currency_rates (uuid, current_rate, reason, previous_rate, change_time)
       VALUES (?, ?, ?, ?, NOW())`,[uuid, rate, reason || null, previous_rate]
    );

    return res.status(201).json({
      message: "Rate updated",
      success: true,
      rate: parseFloat(rate)
    });

  } catch (error) {
    console.error("Update rate error:", error);
    return res.status(500).json({
      message: "Update failed",
      success: false
    });
  }
}

export async function getRateHistory(req, res) {

  try {
    const [rows] = await connection.execute(
      `SELECT 
         change_time AS date,
         current_rate AS rate,
         previous_rate,
         reason
       FROM currency_rates 
       WHERE previous_rate IS NOT NULL
       ORDER BY change_time DESC 
       LIMIT 7`,
    );

    const history = rows.map(row => {
      const change = row.previous_rate 
        ? (row.rate - row.previous_rate).toFixed(4)
        : null;

      return {
        date: new Date(row.date).toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        rate: `$${parseFloat(row.rate).toFixed(4)}`,
        change: change ? (change > 0 ? `+${change}` : change) : '—',
        reason: row.reason || '—'
      };
    });

    return res.status(200).json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load history"
    });
  }
}