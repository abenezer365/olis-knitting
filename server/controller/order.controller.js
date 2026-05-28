import { v4 as uuidv4 } from "uuid";
import connection, { withTransaction } from "../config/database.config.js";
import { getPagination, buildMeta } from "../utils/pagination.js";
import { sendMail } from "../utils/mailer.js";
import {
  orderReceivedEmail,
  orderCompletedEmail,
  orderDeliveredEmail,
  paymentConfirmedEmail,
} from "../utils/emailTemplates.js";

// Place order — creates the customer, order, ordered items and (optional) shipping
// address atomically. Prices are resolved server-side from the products table so
// the client cannot tamper with amounts.
export const placeOrder = async (req, res) => {
  const { customer, items, shipping, shipping_fee_id } = req.body;

  if (
    !customer?.first_name ||
    !customer?.last_name ||
    !customer?.email ||
    !customer?.phone
  ) {
    return res.status(400).json({ message: "Complete customer information is required" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "At least one order item is required" });
  }

  const normalizedItems = items.map((item) => ({
    product_id: Number(item.product_id),
    quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
  }));

  if (normalizedItems.some((item) => !Number.isInteger(item.product_id))) {
    return res.status(400).json({ message: "Invalid product reference in order" });
  }

  try {
    const result = await withTransaction(async (conn) => {
      // Authoritative prices from the DB (never trust client-supplied prices).
      const ids = normalizedItems.map((i) => i.product_id);
      const [products] = await conn.query(
        "SELECT id, price FROM products WHERE id IN (?)",
        [ids]
      );
      const priceById = new Map(products.map((p) => [p.id, Number(p.price)]));

      const missing = ids.filter((id) => !priceById.has(id));
      if (missing.length > 0) {
        const err = new Error(`Unknown product(s): ${missing.join(", ")}`);
        err.statusCode = 400;
        throw err;
      }

      const totalAmount = normalizedItems.reduce(
        (sum, item) => sum + priceById.get(item.product_id) * item.quantity,
        0
      );

      // Customer
      const customerUuid = uuidv4();
      const [customerResult] = await conn.execute(
        "INSERT INTO customers (uuid, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)",
        [customerUuid, customer.first_name, customer.last_name, customer.email, customer.phone]
      );
      const customerId = customerResult.insertId;

      // Order
      const orderUuid = uuidv4();
      const [orderResult] = await conn.execute(
        "INSERT INTO orders (uuid, customer_id, total_amount, shipping_fee_id) VALUES (?, ?, ?, ?)",
        [orderUuid, customerId, totalAmount, shipping_fee_id || null]
      );
      const orderId = orderResult.insertId;

      // Ordered items
      const itemValues = normalizedItems.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        priceById.get(item.product_id),
      ]);
      await conn.query(
        "INSERT INTO ordered_items (order_id, product_id, quantity, price) VALUES ?",
        [itemValues]
      );

      // Shipping address (optional)
      if (shipping && shipping.city) {
        await conn.execute(
          `INSERT INTO shipping_addresses
            (uuid, order_id, customer_id, country, city, sub_city, street, house_number, postal_code, phone_number, additional_info)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            orderId,
            customerId,
            shipping.country || "Ethiopia",
            shipping.city,
            shipping.sub_city || null,
            shipping.street || null,
            shipping.house_number || null,
            shipping.postal_code || null,
            shipping.phone_number || customer.phone,
            shipping.additional_info || null,
          ]
        );
      }

      return { orderId, orderUuid, totalAmount };
    });

    // Confirmation email is best-effort and must not block/affect the response.
    const mail = orderReceivedEmail({
      customerName: `${customer.first_name} ${customer.last_name}`,
      orderId: result.orderId,
      uuid: result.orderUuid,
      email: customer.email,
      phone: customer.phone,
      total: result.totalAmount,
    });
    sendMail({ to: customer.email, subject: mail.subject, html: mail.html });

    return res.status(201).json({
      message: "Order placed successfully",
      success: true,
      order_id: result.orderId,
      uuid: result.orderUuid,
      total_amount: result.totalAmount,
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message, success: false });
    }
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Failed to place order", success: false });
  }
};

const ORDER_SELECT = `
  SELECT
      o.*,
      c.id AS customer_id,
      c.first_name AS customer_fname,
      c.last_name AS customer_lname,
      c.email AS customer_email,
      c.phone AS customer_phone,
      sf.country_name AS shipping_country,
      sf.country_code AS shipping_code,
      sf.starting_price AS shipping_start,
      sf.maximum_price AS shipping_max
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    LEFT JOIN shipping_fee sf ON o.shipping_fee_id = sf.id`;

const mapItems = (items, order) =>
  items.map((item) => ({
    id: item.product_id,
    name: item.product_name,
    image: item.product_image,
    price: item.product_price,
    quantity: item.quantity,
    subtotal: item.subtotal,
    shipping_fee: {
      country: order.shipping_country,
      code: order.shipping_code,
      starting_price: order.shipping_start,
      maximum_price: order.shipping_max,
    },
  }));

const formatOrder = (order, items) => ({
  ...order,
  client: {
    id: order.customer_id,
    fname: order.customer_fname,
    lname: order.customer_lname,
    email: order.customer_email,
    phone: order.customer_phone,
  },
  products: mapItems(items, order),
});

// Get all orders controller (opt-in pagination via ?page/?limit).
export const getAllOrders = async (req, res) => {
  try {
    const { enabled, limit, offset, page } = getPagination(req.query, {
      defaultLimit: 20,
    });

    const [orders] = await connection.query(
      enabled
        ? `${ORDER_SELECT} ORDER BY o.created_at DESC LIMIT ${limit} OFFSET ${offset}`
        : `${ORDER_SELECT} ORDER BY o.created_at DESC`
    );

    let formattedOrders = [];
    if (orders.length > 0) {
      const orderIds = orders.map((o) => o.id);
      const [orderedItems] = await connection.query(
        `SELECT oi.*, p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price AS product_price
         FROM ordered_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id IN (?)`,
        [orderIds]
      );
      const itemsByOrder = new Map();
      for (const item of orderedItems) {
        if (!itemsByOrder.has(item.order_id)) itemsByOrder.set(item.order_id, []);
        itemsByOrder.get(item.order_id).push(item);
      }
      formattedOrders = orders.map((order) =>
        formatOrder(order, itemsByOrder.get(order.id) || [])
      );
    }

    if (enabled) {
      const [[{ total }]] = await connection.query(
        "SELECT COUNT(*) AS total FROM orders"
      );
      return res.status(200).json({
        data: formattedOrders,
        pagination: buildMeta({ page, limit }, total),
      });
    }

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

async function fetchOrderItems(orderId) {
  const [items] = await connection.execute(
    `SELECT oi.*, p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price AS product_price
     FROM ordered_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId]
  );
  return items;
}

// Get single order by id
export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [orderRows] = await connection.execute(`${ORDER_SELECT} WHERE o.id = ?`, [id]);

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = await fetchOrderItems(orderRows[0].id);
    res.status(200).json(formatOrder(orderRows[0], items));
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Get single order by uuid (public order tracking)
export const getSingleOrderByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const [orderRows] = await connection.execute(`${ORDER_SELECT} WHERE o.uuid = ?`, [uuid]);

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = await fetchOrderItems(orderRows[0].id);
    res.status(200).json(formatOrder(orderRows[0], items));
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Loads an order joined with its customer, or returns null.
async function getOrderWithCustomer(id) {
  const [rows] = await connection.execute(
    `SELECT o.*, c.first_name, c.last_name, c.email, c.phone
     FROM orders o JOIN customers c ON o.customer_id = c.id
     WHERE o.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// Update order status controller
export const orderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;
    const valid = ["pending", "processing", "completed", "cancelled"];

    if (!valid.includes(order_status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await getOrderWithCustomer(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await connection.execute("UPDATE orders SET order_status = ? WHERE id = ?", [
      order_status,
      id,
    ]);

    if (order_status === "completed") {
      const mail = orderCompletedEmail({
        customerName: `${order.first_name} ${order.last_name}`,
        orderId: order.id,
        uuid: order.uuid,
        total: order.total_amount,
      });
      sendMail({ to: order.email, subject: mail.subject, html: mail.html });
    }

    return res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Failed to update order status" });
  }
};

// Update delivery status
export const deliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { delivery_status } = req.body;
    const valid = ["not_shipped", "in_transit", "delivered", "returned"];

    if (!valid.includes(delivery_status)) {
      return res.status(400).json({ message: "Invalid delivery status" });
    }

    const order = await getOrderWithCustomer(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await connection.execute("UPDATE orders SET delivery_status = ? WHERE id = ?", [
      delivery_status,
      id,
    ]);

    if (delivery_status === "delivered") {
      const mail = orderDeliveredEmail({
        customerName: `${order.first_name} ${order.last_name}`,
        orderId: order.id,
        total: order.total_amount,
      });
      sendMail({ to: order.email, subject: mail.subject, html: mail.html });
    }

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
    const valid = ["pending", "paid", "failed", "refunded"];

    if (!valid.includes(payment_status)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await getOrderWithCustomer(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await connection.execute("UPDATE orders SET payment_status = ? WHERE id = ?", [
      payment_status,
      id,
    ]);

    if (payment_status === "paid") {
      const mail = paymentConfirmedEmail({
        customerName: `${order.first_name} ${order.last_name}`,
        orderId: order.id,
        uuid: order.uuid,
        total: order.total_amount,
      });
      sendMail({ to: order.email, subject: mail.subject, html: mail.html });
    }

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
    const [result] = await connection.execute("DELETE FROM orders WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ message: "Failed to delete order" });
  }
};
