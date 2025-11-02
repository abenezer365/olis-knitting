import connection from "../config/database.config.js";

// Add ordered items controller
export const addOrderedItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, price } = req.body;

    if (!order_id || !product_id || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if product exists
    const [productRows] = await connection.execute(
      `SELECT id FROM products WHERE id = ?`,
      [product_id]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if order exists
    const [orderRows] = await connection.execute(
      `SELECT id FROM orders WHERE id = ?`,
      [order_id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    await connection.execute(
      `INSERT INTO ordered_items (order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [order_id, product_id, quantity, price]
    );

    return res.status(201).json({ message: "Ordered item added successfully" });
  } catch (error) {
    console.error("Error adding ordered item:", error);
    return res.status(500).json({ message: "Failed to add ordered item" });
  }
};

// Get all ordered items controller
export const getAllOrderedItems = async (req, res) => {
  try {
    const [items] = await connection.execute(
      `SELECT 
          oi.*,
          p.name AS product_name,
          p.image AS product_image
        FROM ordered_items oi
        JOIN products p ON oi.product_id = p.id
        ORDER BY oi.id DESC`
    );

    return res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching ordered items:", error);
    return res.status(500).json({ message: "Failed to fetch ordered items" });
  }
};

// Get ordered items controller
export const getOrderedItemsByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;

    const [items] = await connection.execute(
      `SELECT 
          oi.*,
          p.name AS product_name,
          p.image AS product_image,
          p.price AS product_price
        FROM ordered_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
      [order_id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: "No ordered items found for this order" });
    }

    return res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching ordered items:", error);
    return res.status(500).json({ message: "Failed to fetch ordered items" });
  }
};

// Edit ordered items controller
export const editOrderedItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price } = req.body;

    await connection.execute(
      `UPDATE ordered_items SET quantity = ?, price = ? WHERE id = ?`,
      [quantity, price, id]
    );

    return res.status(200).json({ message: "Ordered item updated successfully" });
  } catch (error) {
    console.error("Error updating ordered item:", error);
    return res.status(500).json({ message: "Failed to update ordered item" });
  }
};

// Delete ordered items controller
export const deleteOrderedItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connection.execute(`DELETE FROM ordered_items WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ordered item not found" });
    }

    return res.status(200).json({ message: "Ordered item deleted successfully" });
  } catch (error) {
    console.error("Error deleting ordered item:", error);
    return res.status(500).json({ message: "Failed to delete ordered item" });
  }
};
