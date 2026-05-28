import env from "../config/env.js";

const BRAND = "Oli's Knitwear";

function longDate(value = new Date()) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function money(amount) {
  return `$${parseFloat(amount || 0).toFixed(2)}`;
}

function infoRow(label, value) {
  return `<div class="info-row"><span class="info-label">${label}&nbsp;</span><span class="info-value">${value}</span></div>`;
}

// Shared responsive shell used by every transactional email.
function layout({ headerGradient, tagline, body, year = new Date().getFullYear() }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${BRAND}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #FAF8F3; font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.6; }
    .container { max-width: 100%; background: linear-gradient(135deg, #FAF8F3 0%, #F5F1E8 100%); }
    .header { background: ${headerGradient}; padding: 50px 20px; text-align: center; color: #FAF8F3; }
    .header-content { max-width: 600px; margin: 0 auto; }
    .brand { font-size: 42px; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; }
    .tagline { font-size: 18px; opacity: 0.9; font-style: italic; }
    .content { padding: 50px 20px; max-width: 600px; margin: 0 auto; }
    .greeting { font-size: 20px; margin-bottom: 30px; }
    .card { background: #FFFFFF; padding: 30px; border-radius: 16px; margin: 30px 0; box-shadow: 0 4px 20px rgba(166, 124, 82, 0.1); text-align: center; }
    .card-title { font-size: 24px; font-weight: bold; color: #A67C52; margin-bottom: 15px; }
    .order-info { background: #F5F1E8; padding: 25px; border-radius: 12px; margin: 25px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #E8E3D8; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666666; }
    .info-value { font-weight: 600; color: #1a1a1a; }
    .total-amount { font-size: 22px; color: #A67C52; font-weight: bold; }
    .cta { text-align: center; margin: 40px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #A67C52 0%, #8B6E4B 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; }
    .note { background: #FFF8F0; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; }
    .reply-box { background: #E8F5E8; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50; text-align: left; }
    .quote-box { background: #FFFFFF; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #E8E3D8; font-style: italic; color: #666666; text-align: left; }
    .footer { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #FAF8F3; text-align: center; padding: 40px 20px; }
    .footer-link { color: #D4C5B0; text-decoration: none; margin: 0 15px; }
    .signature { margin-top: 30px; font-size: 16px; color: #D4C5B0; }
    @media (max-width: 600px) { .header { padding: 40px 20px; } .brand { font-size: 32px; } .content { padding: 30px 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><div class="header-content"><div class="brand">${BRAND}</div><div class="tagline">${tagline}</div></div></div>
    <div class="content">${body}</div>
    <div class="footer">
      <div class="brand" style="font-size: 24px;">${BRAND}</div>
      <div style="margin: 20px 0;">
        <a href="mailto:olis.knitting@gmail.com" class="footer-link">Contact Us</a>
        <a href="${env.appUrl}" class="footer-link" target="_blank" rel="noopener">Visit Website</a>
      </div>
      <div class="signature">
        <p>&copy; ${year} ${BRAND}. All rights reserved.</p>
        <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">Handmade in Ethiopia with Purpose &amp; Pride</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function trackButton(uuid) {
  return `<div class="cta"><a href="${env.appUrl}/order/${uuid}" class="btn" target="_blank" rel="noopener">Track Your Order</a></div>`;
}

export function orderReceivedEmail({ customerName, orderId, uuid, email, phone, total }) {
  const body = `
    <p class="greeting">Dear ${customerName},</p>
    <p>Thank you for choosing ${BRAND}. We've received your order and are excited to begin crafting your pieces.</p>
    <div class="card"><div class="card-title">📦 Order Received</div><p>Your order has been placed successfully and is now being processed.</p></div>
    <div class="order-info">
      ${infoRow("Order Number:", `#${orderId}`)}
      ${infoRow("Order Date:", longDate())}
      ${infoRow("Customer:", customerName)}
      ${infoRow("Email:", email)}
      ${infoRow("Phone:", phone || "—")}
      <div class="info-row"><span class="info-label total-amount">Order Total:&nbsp;</span><span class="info-value total-amount">${money(total)}</span></div>
    </div>
    ${trackButton(uuid)}
    <div class="note"><div class="card-title" style="font-size:18px;">💳 Complete Your Payment</div><p>Please complete payment via bank transfer and share the proof with us:</p><p style="font-family: monospace; background:#fff; padding:15px; border-radius:8px; margin-top:15px;">📧 olis.knitting@gmail.com<br>📱 +251 91 227 3435</p></div>`;
  return {
    subject: `Order Received #${orderId} – ${BRAND}`,
    html: layout({ headerGradient: "linear-gradient(135deg, #D4C5B0 0%, #A67C52 100%)", tagline: "Handcrafted with Purpose & Passion", body }),
  };
}

export function paymentConfirmedEmail({ customerName, orderId, uuid, total }) {
  const body = `
    <p class="greeting">Dear ${customerName},</p>
    <p>Your payment has been successfully processed. Your order is now being prepared with care.</p>
    <div class="card"><div style="font-size:48px;">✅</div><div class="card-title">Payment Confirmed</div><p>Your payment of ${money(total)} has been received. Thank you for your trust in ${BRAND}.</p></div>
    <div class="order-info">
      ${infoRow("Order Number:", `#${orderId}`)}
      ${infoRow("Payment Date:", longDate())}
      <div class="info-row"><span class="info-label">Amount Paid:&nbsp;</span><span class="info-value total-amount">${money(total)}</span></div>
      ${infoRow("Payment Status:", "Confirmed")}
    </div>
    ${trackButton(uuid)}`;
  return {
    subject: `Payment Confirmed #${orderId} – ${BRAND}`,
    html: layout({ headerGradient: "linear-gradient(135deg, #A67C52 0%, #8B6E4B 100%)", tagline: "Payment Successfully Processed", body }),
  };
}

export function orderCompletedEmail({ customerName, orderId, uuid, total }) {
  const body = `
    <p class="greeting">Dear ${customerName},</p>
    <p>Your ${BRAND} order has been completed! Every stitch was carefully crafted just for you.</p>
    <div class="card"><div style="font-size:64px;">✨</div><div class="card-title">Order Completed</div><p>Your handcrafted pieces are now ready.</p></div>
    <div class="order-info">
      ${infoRow("Order Number:", `#${orderId}`)}
      ${infoRow("Completion Date:", longDate())}
      ${infoRow("Customer:", customerName)}
      <div class="info-row"><span class="info-label">Order Total:&nbsp;</span><span class="info-value total-amount">${money(total)}</span></div>
    </div>
    ${trackButton(uuid)}`;
  return {
    subject: `🎊 Order Completed #${orderId} – Ready for You!`,
    html: layout({ headerGradient: "linear-gradient(135deg, #A67C52 0%, #8B6E4B 100%)", tagline: "Your Handcrafted Order is Complete!", body }),
  };
}

export function orderDeliveredEmail({ customerName, orderId, total }) {
  const body = `
    <p class="greeting">Dear ${customerName},</p>
    <p>Your ${BRAND} order has been successfully delivered! We hope your pieces bring you joy.</p>
    <div class="card"><div style="font-size:64px;">🎁</div><div class="card-title" style="color:#2E7D32;">Successfully Delivered!</div><p>Order #${orderId} was delivered on ${longDate()}.</p></div>
    <div class="order-info">
      ${infoRow("Order Number:", `#${orderId}`)}
      ${infoRow("Delivery Date:", longDate())}
      <div class="info-row"><span class="info-label">Order Total:&nbsp;</span><span class="info-value total-amount">${money(total)}</span></div>
      ${infoRow("Status:", "Delivered")}
    </div>
    <div class="cta"><a href="${env.appUrl}/contact" class="btn" target="_blank" rel="noopener">Share Your Experience</a></div>`;
  return {
    subject: `🎉 Your Order Has Been Delivered! #${orderId}`,
    html: layout({ headerGradient: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)", tagline: "Your Handcrafted Treasure Has Arrived!", body }),
  };
}

export function messageReplyEmail({ customerName, originalMessage, reply, sentAt }) {
  const body = `
    <p class="greeting">Dear ${customerName},</p>
    <p>Thank you for reaching out. We've reviewed your message and are glad to respond.</p>
    <div class="card" style="text-align:left;">
      <div class="card-title" style="text-align:center;">💬 Your Message Response</div>
      <div style="font-size:14px; color:#666; text-transform:uppercase; letter-spacing:1px; margin-top:10px;">Your Original Message</div>
      <div class="quote-box">"${originalMessage}"</div>
      <div style="font-size:13px; color:#666; text-align:right;">Sent on: ${longDate(sentAt)}</div>
      <div style="font-size:14px; color:#666; text-transform:uppercase; letter-spacing:1px; margin-top:20px;">Our Response</div>
      <div class="reply-box">${reply}</div>
      <div style="font-size:13px; color:#666; text-align:right; margin-top:10px;">Replied on: ${longDate()}</div>
    </div>
    <div class="note"><p style="font-style:italic; color:#666;">Your satisfaction is our highest priority. We're committed to service that matches the quality of our handcrafted pieces.</p></div>`;
  return {
    subject: `💌 Response to Your Message – ${BRAND}`,
    html: layout({ headerGradient: "linear-gradient(135deg, #D4C5B0 0%, #A67C52 100%)", tagline: "Response to Your Message", body }),
  };
}
