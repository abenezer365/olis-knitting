import { v4 as uuidv4 } from "uuid";
import connection from "../config/database.config.js"
import nodemailer from "nodemailer"

// Place order controller
export const placeOrder = async (req, res) => {
  const { customer_id, total_amount, shipping_fee_id } = req.body;
  try {

    if (!customer_id || !total_amount) {
      return res.status(400).json({ message: "Customer ID and total amount are required" });
    }

    const newOrder = {
      uuid: uuidv4(),
      customer_id,
      total_amount,
      shipping_fee_id: shipping_fee_id || null,
    };

    const [result] = await connection.execute(
      `INSERT INTO orders (uuid, customer_id, total_amount, shipping_fee_id)
      VALUES (?, ?, ?, ?)`,
      [newOrder.uuid, newOrder.customer_id, newOrder.total_amount, newOrder.shipping_fee_id]
    );

    const orderId = result.insertId;

    // Fetch customer details
    const [customerRows] = await connection.execute(
      "SELECT first_name, last_name, email, phone FROM customers WHERE id = ?",
      [customer_id]
    );
    
    if (customerRows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = customerRows[0];
    const customerName = `${customer.first_name} ${customer.last_name}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const now = new Date().getFullYear();
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const mailOptions = {
      from: `"Oli's Knitwear" <${process.env.EMAIL}>`,
      to: customer.email,
      subject: `Order Received #${orderId} – Oli's Knitwear`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Received - Oli's Knitwear</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #FAF8F3; font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.6; }
    .container { max-width: 100%; background: linear-gradient(135deg, #FAF8F3 0%, #F5F1E8 100%); }
    .header { background: linear-gradient(135deg, #D4C5B0 0%, #A67C52 100%); padding: 50px 20px; text-align: center; color: #1a1a1a; }
    .header-content { max-width: 600px; margin: 0 auto; }
    .brand { font-size: 42px; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; }
    .tagline { font-size: 18px; opacity: 0.9; font-style: italic; }
    .content { padding: 50px 20px; max-width: 600px; margin: 0 auto; }
    .greeting { font-size: 20px; margin-bottom: 30px; color: #1a1a1a; }
    .status-card { background: #FFFFFF; padding: 30px; border-radius: 16px; margin: 30px 0; box-shadow: 0 4px 20px rgba(166, 124, 82, 0.1); }
    .status-title { font-size: 24px; font-weight: bold; color: #A67C52; margin-bottom: 15px; }
    .order-info { background: #F5F1E8; padding: 25px; border-radius: 12px; margin: 25px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #E8E3D8; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666666; }
    .info-value { font-weight: 600; color: #1a1a1a; }
    .total-amount { font-size: 24px; color: #A67C52; font-weight: bold; }
    .tracking-section { text-align: center; margin: 40px 0; }
    .track-btn { display: inline-block; background: linear-gradient(135deg, #A67C52 0%, #8B6E4B 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(166, 124, 82, 0.3); transition: transform 0.2s; }
    .track-btn:hover { transform: translateY(-2px); }
    .payment-info { background: #FFF8F0; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; }
    .payment-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #1a1a1a; }
    .contact-details { font-family: monospace; background: #FFFFFF; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .story-section { background: #FFFFFF; padding: 30px; border-radius: 16px; margin: 30px 0; font-style: italic; text-align: center; }
    .story-text { color: #666666; line-height: 1.8; }
    .footer { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #FAF8F3; text-align: center; padding: 40px 20px; }
    .footer-content { max-width: 600px; margin: 0 auto; }
    .footer-links { margin: 20px 0; }
    .footer-link { color: #D4C5B0; text-decoration: none; margin: 0 15px; }
    .signature { margin-top: 30px; font-size: 16px; color: #D4C5B0; }
    @media (max-width: 600px) {
      .header { padding: 40px 20px; }
      .brand { font-size: 32px; }
      .content { padding: 30px 20px; }
      .status-card, .order-info { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="brand">Oli's Knitwear</div>
        <div class="tagline">Handcrafted with Purpose & Passion</div>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear ${customerName},</p>
      
      <p>Thank you for choosing Oli's Knitwear. We've successfully received your order and are excited to begin crafting your unique pieces.</p>

      <div class="status-card">
        <div class="status-title">📦 Order Received</div>
        <p>Your order has been placed successfully and is now being processed. We'll notify you once your items are ready to ship.</p>
      </div>

      <!-- Order Information -->
      <div class="order-info">
        <div class="info-row">
          <span class="info-label">Order Number: </span>
          <span class="info-value">#${orderId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Order Date: </span>
          <span class="info-value">${currentDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Customer: </span>
          <span class="info-value">${customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email: </span>
          <span class="info-value">${customer.email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone: </span>
          <span class="info-value">${customer.phone}</span>
        </div>
        <div class="info-row">
          <span class="info-label total-amount">Order Total: </span>
          <span class="info-value total-amount">$${parseFloat(total_amount).toFixed(2)}</span>
        </div>
      </div>

      <!-- Tracking Section -->
      <div class="tracking-section">
        <a style="color:white;" href="http://localhost:5173/order/${newOrder.uuid}" class="track-btn" target="_blank">
          Track Your Order
        </a>
        <p style="margin-top: 15px; color: #666666; font-size: 14px;">
          Click above to monitor your order status in real-time
        </p>
      </div>

      <!-- Payment Information -->
      <div class="payment-info">
        <div class="payment-title">💳 Complete Your Payment</div>
        <p>To proceed with your order, please complete the payment via bank transfer and share the proof with us:</p>
        <div class="contact-details">
          📧 payments@olisknitwear.com<br>
          📱 +251 911 234 567
        </div>
      </div>

      <!-- Brand Story -->
      <div class="story-section">
        <p class="story-text">
          "Every stitch tells a story of empowerment. Oli's Knitwear began as a mother's love for her family, 
          weaving warmth and comfort into every piece. Today, it's a movement supporting women artisans in Ethiopia, 
          creating sustainable fashion that makes a difference."
        </p>
      </div>

      <p>We appreciate your trust in us and look forward to delivering exceptional craftsmanship to you.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-content">
        <div class="brand" style="color: #FAF8F3; font-size: 24px;">Oli's Knitwear</div>
        <div class="footer-links">
          <a style="color:white;" href="mailto:info@olisknitwear.com" class="footer-link">Contact Us</a>
          <a style="color:white;" href="https://olisknitting.netlify.app" class="footer-link" target="_blank">Visit Website</a>
        </div>
        <div class="signature">
          <p>&copy; ${now} Oli's Knitwear. All rights reserved.</p>
          <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
            Handmade in Ethiopia with Purpose & Pride
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Order placed successfully",
      order_id: orderId,
      uuid: newOrder.uuid,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
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
          c.phone AS customer_phone,
          sf.country_name AS shipping_country,
          sf.country_code AS shipping_code,
          sf.starting_price AS shipping_start,
          sf.maximum_price AS shipping_max
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN shipping_fee sf ON o.shipping_fee_id = sf.id
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
          subtotal: item.subtotal,
          shipping_fee: {
              country: order.shipping_country,
              code: order.shipping_code,
              starting_price: order.shipping_start,
              maximum_price: order.shipping_max
        },
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
          c.phone AS customer_phone,
          sf.country_name AS shipping_country,
          sf.country_code AS shipping_code,
          sf.starting_price AS shipping_start,
          sf.maximum_price AS shipping_max
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN shipping_fee sf ON o.shipping_fee_id = sf.id
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
      subtotal: item.subtotal,
      shipping_fee: {
          country: order.shipping_country,
          code: order.shipping_code,
          starting_price: order.shipping_start,
          maximum_price: order.shipping_max
      },
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
          c.phone AS customer_phone,
          sf.country_name AS shipping_country,
          sf.country_code AS shipping_code,
          sf.starting_price AS shipping_start,
          sf.maximum_price AS shipping_max
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN shipping_fee sf ON o.shipping_fee_id = sf.id
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
      subtotal: item.subtotal,
      shipping_fee: {
          country: order.shipping_country,
          code: order.shipping_code,
          starting_price: order.shipping_start,
          maximum_price: order.shipping_max
    },
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

    // Get order details with customer information for email
    const [orderRows] = await connection.execute(
      `SELECT o.*, c.first_name, c.last_name, c.email, c.phone 
       FROM orders o 
       JOIN customers c ON o.customer_id = c.id 
       WHERE o.id = ?`,
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRows[0];
    const customerName = `${order.first_name} ${order.last_name}`;

    await connection.execute(
      `UPDATE orders SET delivery_status = ? WHERE id = ?`, 
      [delivery_status, id]
    );

    // Send delivery confirmation email if status is 'delivered'
    if (delivery_status === 'delivered') {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const now = new Date().getFullYear();
      const deliveryDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const mailOptions = {
        from: `"Oli's Knitwear" <${process.env.EMAIL}>`,
        to: order.email,
        subject: `🎉 Your Order Has Been Delivered! #${order.id}`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Delivered - Oli's Knitwear</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #FAF8F3; font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.6; }
    .container { max-width: 100%; background: linear-gradient(135deg, #FAF8F3 0%, #F5F1E8 100%); }
    .header { background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%); padding: 50px 20px; text-align: center; color: #FAF8F3; }
    .header-content { max-width: 600px; margin: 0 auto; }
    .brand { font-size: 42px; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; }
    .tagline { font-size: 18px; opacity: 0.9; font-style: italic; }
    .content { padding: 50px 20px; max-width: 600px; margin: 0 auto; }
    .greeting { font-size: 20px; margin-bottom: 30px; color: #1a1a1a; }
    .celebration-card { background: #FFFFFF; padding: 40px; border-radius: 20px; margin: 30px 0; box-shadow: 0 8px 30px rgba(46, 125, 50, 0.15); text-align: center; }
    .celebration-icon { font-size: 64px; margin-bottom: 20px; }
    .celebration-title { font-size: 32px; font-weight: bold; color: #2E7D32; margin-bottom: 15px; }
    .delivery-info { background: #E8F5E8; padding: 30px; border-radius: 16px; margin: 30px 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .info-item { text-align: center; padding: 15px; }
    .info-label { font-size: 14px; color: #666666; margin-bottom: 5px; }
    .info-value { font-size: 16px; font-weight: 600; color: #1a1a1a; }
    .next-steps { background: #FFFFFF; padding: 30px; border-radius: 16px; margin: 30px 0; border-left: 4px solid #A67C52; }
    .steps-title { font-size: 22px; font-weight: bold; color: #A67C52; margin-bottom: 20px; }
    .step { display: flex; align-items: flex-start; margin: 20px 0; }
    .step-icon { background: #A67C52; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }
    .step-content { flex: 1; }
    .step-title { font-weight: 600; color: #1a1a1a; margin-bottom: 5px; }
    .review-section { text-align: center; margin: 40px 0; }
    .review-btn { display: inline-block; background: linear-gradient(135deg, #A67C52 0%, #8B6E4B 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(166, 124, 82, 0.3); transition: transform 0.2s; }
    .review-btn:hover { transform: translateY(-2px); }
    .story-section { background: #FFF8F0; padding: 30px; border-radius: 16px; margin: 30px 0; text-align: center; }
    .story-text { color: #666666; line-height: 1.8; font-style: italic; }
    .footer { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #FAF8F3; text-align: center; padding: 40px 20px; }
    .footer-content { max-width: 600px; margin: 0 auto; }
    .footer-links { margin: 20px 0; }
    .footer-link { color: #D4C5B0; text-decoration: none; margin: 0 15px; }
    .signature { margin-top: 30px; font-size: 16px; color: #D4C5B0; }
    @media (max-width: 600px) {
      .header { padding: 40px 20px; }
      .brand { font-size: 32px; }
      .content { padding: 30px 20px; }
      .celebration-card { padding: 30px 20px; }
      .info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="brand">Oli's Knitwear</div>
        <div class="tagline">Your Handcrafted Treasure Has Arrived!</div>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear ${customerName},</p>
      
      <p>We're absolutely thrilled to let you know that your Oli's Knitwear order has been successfully delivered! We hope your handcrafted pieces bring you as much joy as we had creating them.</p>

      <!-- Celebration Card -->
      <div class="celebration-card">
        <div class="celebration-icon">🎁</div>
        <div class="celebration-title">Successfully Delivered!</div>
        <p>Your order #${order.id} was delivered on ${deliveryDate}. We hope you love your new handcrafted pieces!</p>
      </div>

      <!-- Delivery Information -->
      <div class="delivery-info">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Order Number</div>
            <div class="info-value">#${order.id}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Delivery Date</div>
            <div class="info-value">${deliveryDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Order Total</div>
            <div class="info-value">$${parseFloat(order.total_amount).toFixed(2)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value" style="color: #2E7D32; font-weight: bold;">Delivered</div>
          </div>
        </div>
      </div>

      <!-- Review Section -->
      <div class="review-section">
        <p style="margin-bottom: 20px; color: #666666; font-size: 16px;">
          Love your new pieces? Share your experience and help other customers discover the beauty of handcrafted knitwear.
        </p>
        <a style="color:white;" href="https://olisknitting.netlify.app/contact" class="review-btn" target="_blank">
          Share Your Experience
        </a>
      </div>

      <!-- Brand Story -->
      <div class="story-section">
        <p class="story-text">
          "Every thread in your new knitwear carries the story of Ethiopian women artisans, their skills passed through generations, and their dreams woven into each stitch. Thank you for being part of this beautiful journey."
        </p>
      </div>

      <p style="text-align: center; margin-top: 30px;">
        Thank you for choosing Oli's Knitwear. We're honored to be part of your story and look forward to crafting for you again soon!
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-content">
        <div class="brand" style="color: #FAF8F3; font-size: 24px;">Oli's Knitwear</div>
        <div class="footer-links">
          <a href="mailto:care@olisknitwear.com" class="footer-link">Care Instructions</a>
          <a href="https://olisknitting.netlify.app" class="footer-link" target="_blank">Shop Again</a>
          <a href="mailto:support@olisknitwear.com" class="footer-link">Support</a>
        </div>
        <div class="signature">
          <p>&copy; ${now} Oli's Knitwear. All rights reserved.</p>
          <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
            Handcrafted with Love in Ethiopia
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
        `,
      };

      await transporter.sendMail(mailOptions);
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

    const validStatuses = ["pending", "paid", "failed", "refunded"];

    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // Get order details with customer information
    const [orderRows] = await connection.execute(
      `SELECT o.*, c.first_name, c.last_name, c.email, c.phone 
       FROM orders o 
       JOIN customers c ON o.customer_id = c.id 
       WHERE o.id = ?`,
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRows[0];
    const customerName = `${order.first_name} ${order.last_name}`;

    await connection.execute(
      `UPDATE orders SET payment_status = ? WHERE id = ?`, 
      [payment_status, id]
    );

    // Send payment confirmation email if status is 'paid'
    if (payment_status === 'paid') {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const now = new Date().getFullYear();
      const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const mailOptions = {
        from: `"Oli's Knitwear" <${process.env.EMAIL}>`,
        to: order.email,
        subject: `Payment Confirmed #${order.id} – Oli's Knitwear`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Confirmed - Oli's Knitwear</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #FAF8F3; font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.6; }
    .container { max-width: 100%; background: linear-gradient(135deg, #FAF8F3 0%, #F5F1E8 100%); }
    .header { background: linear-gradient(135deg, #A67C52 0%, #8B6E4B 100%); padding: 50px 20px; text-align: center; color: #1a1a1a; }
    .header-content { max-width: 600px; margin: 0 auto; }
    .brand { font-size: 42px; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; color: #FAF8F3; }
    .tagline { font-size: 18px; opacity: 0.9; font-style: italic; color: #FAF8F3; }
    .content { padding: 50px 20px; max-width: 600px; margin: 0 auto; }
    .greeting { font-size: 20px; margin-bottom: 30px; color: #1a1a1a; }
    .status-card { background: #FFFFFF; padding: 30px; border-radius: 16px; margin: 30px 0; box-shadow: 0 4px 20px rgba(166, 124, 82, 0.1); text-align: center; }
    .status-title { font-size: 28px; font-weight: bold; color: #A67C52; margin-bottom: 15px; }
    .status-icon { font-size: 48px; margin-bottom: 20px; }
    .order-info { background: #F5F1E8; padding: 25px; border-radius: 12px; margin: 25px 0; }
    .info-row { display: flex; justify-content: space-between; align-items:center; padding: 12px 0; border-bottom: 1px solid #E8E3D8; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666666; }
    .info-value { font-weight: 600; color: #1a1a1a; }
    .total-amount { font-size: 24px; color: #A67C52; font-weight: bold; }
    .tracking-section { text-align: center; margin: 40px 0; }
    .track-btn { display: inline-block; background: linear-gradient(135deg, #A67C52 0%, #8B6E4B 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(166, 124, 82, 0.3); transition: transform 0.2s; }
    .track-btn:hover { transform: translateY(-2px); }
    .next-steps { background: #E8F5E8; padding: 25px; border-radius: 12px; margin: 30px 0; }
    .steps-title { font-size: 20px; font-weight: bold; color: #2E7D32; margin-bottom: 15px; }
    .step { display: flex; align-items: center; margin: 15px 0; }
    .step-number { background: #2E7D32; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }
    .story-section { background: #FFFFFF; padding: 30px; border-radius: 16px; margin: 30px 0; font-style: italic; text-align: center; }
    .story-text { color: #666666; line-height: 1.8; }
    .footer { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #FAF8F3; text-align: center; padding: 40px 20px; }
    .footer-content { max-width: 600px; margin: 0 auto; }
    .footer-links { margin: 20px 0; }
    .footer-link { color: #D4C5B0; text-decoration: none; margin: 0 15px; }
    .signature { margin-top: 30px; font-size: 16px; color: #D4C5B0; }
    @media (max-width: 600px) {
      .header { padding: 40px 20px; }
      .brand { font-size: 32px; }
      .content { padding: 30px 20px; }
      .status-card, .order-info { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="brand">Oli's Knitwear</div>
        <div class="tagline">Payment Successfully Processed</div>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear ${customerName},</p>
      
      <p>We're delighted to inform you that your payment has been successfully processed. Your order is now being prepared with care.</p>

      <div class="status-card">
        <div class="status-icon">✅</div>
        <div class="status-title">Payment Confirmed</div>
        <p>Your payment of $${parseFloat(order.total_amount).toFixed(2)} has been successfully processed. Thank you for your trust in Oli's Knitwear.</p>
      </div>

      <!-- Order Information -->
      <div class="order-info">
        <div class="info-row">
          <span class="info-label">Order Number: &nbsp;</span>
          <span class="info-value">#${order.id}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Date: &nbsp;</span>
          <span class="info-value">${currentDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Amount Paid: &nbsp;</span>
          <span class="info-value total-amount">$${parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Status: &nbsp;</span>
          <span class="info-value" style="color: #2E7D32; font-weight: bold;">Confirmed</span>
        </div>
      </div>


      <!-- Tracking Section -->
      <div class="tracking-section">
        <a style="color:white;" href="http://localhost:5173/order/${order.uuid}" class="track-btn" target="_blank">
          Track Your Order
        </a>
        <p style="margin-top: 15px; color: #666666; font-size: 14px;">
          Monitor your order status and estimated delivery
        </p>
      </div>

      <!-- Brand Story -->
      <div class="story-section">
        <p class="story-text">
          "Your support empowers women artisans in Ethiopia, creating sustainable fashion that tells a story of hope, dignity, and craftsmanship passed down through generations."
        </p>
      </div>

      <p>We appreciate your business and look forward to delivering exceptional quality to you. If you have any questions, feel free to reach out to our customer care team.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-content">
        <div class="brand" style="color: #FAF8F3; font-size: 24px;">Oli's Knitwear</div>
        <div class="footer-links">
          <a href="mailto:support@olisknitwear.com" class="footer-link">Customer Support</a>
          <a href="https://olisknitting.netlify.app" class="footer-link" target="_blank">Visit Website</a>
        </div>
        <div class="signature">
          <p>&copy; ${now} Oli's Knitwear. All rights reserved.</p>
          <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
            Crafting Stories, Empowering Lives
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
        `,
      };

      await transporter.sendMail(mailOptions);
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
