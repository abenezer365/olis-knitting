import { v4 as uuidv4 } from "uuid";
import connection from "../config/database.config.js";

// GET /shippingFee/all
export const getAllShippingFees = async (req, res) => {
  try {
    const [rows] = await connection.execute("SELECT * FROM shipping_fee ORDER BY country_name ASC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching shipping fees:", error);
    res.status(500).json({ message: "Failed to fetch shipping fees" });
  }
};

// POST /shippingFee/add
export const addShippingFee = async (req, res) => {
  try {
    const { country_name, country_code, starting_price, maximum_price } = req.body;

if (
  !country_name?.trim() ||
  !country_code?.trim() ||
  starting_price === undefined ||
  starting_price === null ||
  maximum_price === undefined ||
  maximum_price === null
) {
  return res.status(400).json({ message: "All fields are required" });
}


    const uuid = uuidv4();
    await connection.execute(
      `INSERT INTO shipping_fee (uuid, country_name, country_code, starting_price, maximum_price)
       VALUES (?, ?, ?, ?, ?)`,
      [uuid, country_name, country_code, starting_price, maximum_price]
    );

    res.status(201).json({ message: "Shipping fee added successfully", uuid });
  } catch (error) {
    console.error("Error adding shipping fee:", error);
    res.status(500).json({ message: "Failed to add shipping fee" });
  }
};

// PATCH /shippingFee/:id
export const updateShippingFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { country_name, country_code, starting_price, maximum_price } = req.body;

    const [result] = await connection.execute(
      `UPDATE shipping_fee
       SET country_name = COALESCE(?, country_name),
           country_code = COALESCE(?, country_code),
           starting_price = COALESCE(?, starting_price),
           maximum_price = COALESCE(?, maximum_price)
       WHERE id = ?`,
      [country_name, country_code, starting_price, maximum_price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Shipping fee not found" });
    }

    res.status(200).json({ message: "Shipping fee updated successfully" });
  } catch (error) {
    console.error("Error updating shipping fee:", error);
    res.status(500).json({ message: "Failed to update shipping fee" });
  }
};


// DELETE /shippingFee/:id
export async function deleteShippingFee(req, res) {
  const { id } = req.params;

  try {
    // check if the shipping fee exists
    const [rows] = await connection.execute(
      "SELECT * FROM shipping_fee WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Shipping fee not found" });
    }

    // delete the record
    await connection.execute("DELETE FROM shipping_fee WHERE id = ?", [id]);

    res.status(200).json({ message: "Shipping fee deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipping fee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
