import { v4 as uuidv4 } from "uuid";
import connection from "../config/database.config.js";

export const addShipping = async (req, res) => {
  try {
    const {
      order_id,
      customer_id,
      country,
      city,
      sub_city,
      street,
      house_number,
      postal_code,
      phone_number,
      additional_info,
    } = req.body;

    if (!order_id || !customer_id || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const uuid = uuidv4();

    const [result] = await connection.execute(
      `INSERT INTO shipping_addresses 
        (uuid, order_id, customer_id, country, city, sub_city, street, house_number, postal_code, phone_number, additional_info)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        order_id,
        customer_id,
        country,
        city,
        sub_city,
        street,
        house_number,
        postal_code,
        phone_number,
        additional_info,
      ]
    );

    res.status(201).json({
      message: "Shipping address added successfully",
      shipping: { id: result.insertId, uuid, order_id, customer_id },
    });
  } catch (err) {
    console.error("Error adding shipping address:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getShippingByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({ message: "Order UUID is required" });
    }

    // Fix: await the query and check the array length
    const [orderRows] = await connection.execute(
      `SELECT id FROM orders WHERE uuid = ?`,
      [uuid]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "No order found for this uuid" });
    }

    const orderId = orderRows[0].id;

    const [rows] = await connection.execute(
      `SELECT s.*, 
              c.first_name, c.last_name, c.email, c.phone 
       FROM shipping_addresses AS s
       JOIN customers AS c ON s.customer_id = c.id
       WHERE s.order_id = ?`,
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No shipping address found for this order" });
    }

    res.status(200).json({
      message: "Shipping address fetched successfully",
      shipping: rows[0],
    });
  } catch (error) {
    console.error("Error fetching shipping address:", error);
    res.status(500).json({ message: "Server error" });
  }
};