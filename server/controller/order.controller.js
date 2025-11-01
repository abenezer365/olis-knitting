import { v4 as uuidv4 } from "uuid";
import connection from "../config/database.config.js"

// Place order controller
export const placeOrder = async (req, res) => {
  const { customer_id, total_amount, payment_method } = req.body;
  try {

    if (!customer_id || !total_amount) {
      return res.status(400).json({ message: "Customer ID and total amount are required" });
    }

    const newOrder = {
      uuid: uuidv4(),
      customer_id,
      total_amount,
      payment_method: payment_method || "bank_transfer",
    };

    const [result] = await connection.execute(
      `INSERT INTO orders (uuid, customer_id, total_amount, payment_method)
       VALUES (?, ?, ?, ?)`,
      [newOrder.uuid, newOrder.customer_id, newOrder.total_amount, newOrder.payment_method]
    );

    res.status(201).json({
      message: "Order placed successfully",
      order_id: result.insertId,
      uuid: newOrder.uuid,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Get all orders controller
export const getAllOrders = async (req, res) => {
  try {
    // Step 1: Fetch all orders with customer info
    const [orders] = await connection.execute(
      `SELECT 
          o.*,
          c.id AS customer_id,
          c.first_name AS customer_fname,
          c.last_name AS customer_lname,
          c.email AS customer_email,
          c.phone AS customer_phone
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        ORDER BY o.created_at DESC`
    );

    // Step 2: Fetch all ordered items + product info
    const [orderedItems] = await connection.execute(
      `SELECT 
          oi.*,
          p.id AS product_id,
          p.name AS product_name,
          p.image AS product_image,
          p.price AS product_price
        FROM ordered_items oi
        JOIN products p ON oi.product_id = p.id`
    );

    // Step 3: Group products under each order
    const formattedOrders = orders.map(order => {
      const products = orderedItems
        .filter(item => item.order_id === order.id)
        .map(item => ({
          id: item.product_id,
          name: item.product_name,
          image: item.product_image,
          price: item.product_price,
          quantity: item.quantity,
          subtotal: item.subtotal
        }));

      return {
        ...order,
        client: {
          id: order.customer_id,
          fname: order.customer_fname,
          lname: order.customer_lname,
          email: order.customer_email,
          phone: order.customer_phone
        },
        products
      };
    });

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get single order controller
export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Fetch order with customer info
    const [orderRows] = await connection.execute(
      `SELECT 
          o.*,
          c.id AS customer_id,
          c.first_name AS customer_fname,
          c.last_name AS customer_lname,
          c.email AS customer_email,
          c.phone AS customer_phone
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ?`,
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRows[0];

    // Step 2: Fetch ordered items for this order
    const [items] = await connection.execute(
      `SELECT 
          oi.*,
          p.id AS product_id,
          p.name AS product_name,
          p.image AS product_image,
          p.price AS product_price
        FROM ordered_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
      [id]
    );

    const products = items.map(item => ({
      id: item.product_id,
      name: item.product_name,
      image: item.product_image,
      price: item.product_price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    const formattedOrder = {
      ...order,
      client: {
        id: order.customer_id,
        fname: order.customer_fname,
        lname: order.customer_lname,
        email: order.customer_email,
        phone: order.customer_phone
      },
      products
    };

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Get order by uuid
export const getSingleOrderByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Step 1: Fetch order with customer info
    const [orderRows] = await connection.execute(
      `SELECT 
          o.*,
          c.id AS customer_id,
          c.first_name AS customer_fname,
          c.last_name AS customer_lname,
          c.email AS customer_email,
          c.phone AS customer_phone
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.uuid = ?`,
      [uuid]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRows[0];

    // Step 2: Fetch ordered items for this order
    const [items] = await connection.execute(
      `SELECT 
          oi.*,
          p.id AS product_id,
          p.name AS product_name,
          p.image AS product_image,
          p.price AS product_price
        FROM ordered_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
      [order.id]
    );

    const products = items.map(item => ({
      id: item.product_id,
      name: item.product_name,
      image: item.product_image,
      price: item.product_price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    const formattedOrder = {
      ...order,
      client: {
        id: order.customer_id,
        fname: order.customer_fname,
        lname: order.customer_lname,
        email: order.customer_email,
        phone: order.customer_phone
      },
      products
    };

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};


// Update order status controller
export const orderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    const validStatuses = ["pending", "processing", "completed", "cancelled"];

    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    await connection.execute(`UPDATE orders SET order_status = ? WHERE id = ?`, [order_status, id]);

    return res.status(200).json({ 
        message: "Order status updated successfully" 
    });

  } catch (error) {

    console.error("Error updating order status:", error);
    return res.status(500).json({
         message: "Failed to update order status" 
        });
  }
};

// Update delivery status
export const deliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { delivery_status } = req.body;

    const validStatuses = ["not_shipped", "in_transit", "delivered", "returned"];

    if (!validStatuses.includes(delivery_status)) {
      return res.status(400).json({ message: "Invalid delivery status" });
    }

    await connection.execute(`UPDATE orders SET delivery_status = ? WHERE id = ?`, 
        [delivery_status, id]);

    return res.status(200).json({ message: "Delivery status updated successfully" });
  } catch (error) {

    console.error("Error updating delivery status:", error);
    return res.status(500).json({ message: "Failed to update delivery status" });
  }
};

// Update payment status
export const paymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const validStatuses = ["pending", "paid", "failed", "refunded"];

    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    await connection.execute(`UPDATE orders SET payment_status = ? WHERE id = ?`, 
        [payment_status, id]);
    return res.status(200).json({ message: "Payment status updated successfully" });

  } catch (error) {

    console.error("Error updating payment status:", error);
    return res.status(500).json({ message: "Failed to update payment status" });
  }
};

// Delete order controller
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connection.execute(`DELETE FROM orders WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ message: "Failed to delete order" });
  }
};
