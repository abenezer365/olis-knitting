import { v4 as uuidv4 } from "uuid";
import connection from "../config/database.config.js"
import transporter from "../utils/mailer.util.js"

// Write message controller
export const writeMessage = async (req, res) => {
  try {
    const { first_name, last_name, email, subject, message } = req.body;

    if (!first_name || !last_name || !email || !message) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const uuid = uuidv4();

    await connection.execute(
      `INSERT INTO messages (uuid, first_name, last_name, email, subject, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuid, first_name, last_name, email, subject || null, message]
    );

    res.status(201).json({
      message: "Message sent successfully",
      uuid,
    });
  } catch (error) {
    console.error("Error writing message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Reply message controller
export const replyMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    // First get the message details with user information
    const [messageRows] = await connection.execute(
      `SELECT * FROM messages WHERE id = ?`,
      [id]
    );

    if (messageRows.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    const message = messageRows[0];
    const userName = `${message.first_name} ${message.last_name}`;

    // Update the message with reply
    const [result] = await connection.execute(
      `UPDATE messages SET reply = ?, replied_at = NOW() WHERE id = ?`,
      [reply, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Send beautiful email notification to the user
    const now = new Date().getFullYear();
    const replyDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: `"Oli's Knitwear Support" <${process.env.EMAIL}>`,
      to: message.email,
      subject: `💌 Response to Your Message - Oli's Knitwear`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Response to Your Message - Oli's Knitwear</title>
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
    .response-card { background: #FFFFFF; padding: 40px; border-radius: 20px; margin: 30px 0; box-shadow: 0 8px 30px rgba(166, 124, 82, 0.1); }
    .card-title { font-size: 24px; font-weight: bold; color: #A67C52; margin-bottom: 25px; text-align: center; }
    .message-section { background: #F5F1E8; padding: 25px; border-radius: 12px; margin: 20px 0; }
    .section-title { font-size: 16px; font-weight: 600; color: #666666; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .original-message { background: #FFFFFF; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #E8E3D8; font-style: italic; color: #666666; }
    .admin-reply { background: #E8F5E8; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50; }
    .reply-text { color: #1a1a1a; line-height: 1.7; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
    .info-item { text-align: center; padding: 20px; background: #F5F1E8; border-radius: 12px; }
    .info-label { font-size: 14px; color: #666666; margin-bottom: 8px; }
    .info-value { font-size: 16px; font-weight: 600; color: #1a1a1a; }
    .action-section { text-align: center; margin: 40px 0; }
    .action-btn { display: inline-block; background: linear-gradient(135deg, #A67C52 0%, #8B6E4B 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(166, 124, 82, 0.3); transition: transform 0.2s; }
    .action-btn:hover { transform: translateY(-2px); }
    .support-note { background: #FFF8F0; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; }
    .footer { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #FAF8F3; text-align: center; padding: 40px 20px; }
    .footer-content { max-width: 600px; margin: 0 auto; }
    .footer-links { margin: 20px 0; }
    .footer-link { color: #D4C5B0; text-decoration: none; margin: 0 15px; }
    .signature { margin-top: 30px; font-size: 16px; color: #D4C5B0; }
    @media (max-width: 600px) {
      .header { padding: 40px 20px; }
      .brand { font-size: 32px; }
      .content { padding: 30px 20px; }
      .response-card { padding: 30px 20px; }
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
        <div class="tagline">Response to Your Message</div>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear ${userName},</p>
      
      <p>Thank you for reaching out to us. We've carefully reviewed your message and are delighted to provide you with a personalized response.</p>

      <div class="response-card">
        <div class="card-title">💬 Your Message Response</div>
        
        <!-- Original Message -->
        <div class="message-section">
          <div class="section-title">Your Original Message</div>
          <div class="original-message">
            "${message.message}"
          </div>
          <div style="font-size: 14px; color: #666666; text-align: right;">
            Sent on: ${new Date(message.created_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
          </div>
        </div>

        <!-- Admin Reply -->
        <div class="admin-reply">
          <div class="section-title">Our Response</div>
          <div class="reply-text">
            ${reply}
          </div>
          <div style="font-size: 14px; color: #666666; text-align: right; margin-top: 15px;">
            Replied on: ${replyDate}
          </div>
        </div>
      </div>

      <!-- Information Grid -->
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Response Time</div>
          <div class="info-value">Within 24 Hours</div>
        </div>
        <div class="info-item">
          <div class="info-label">Support Team</div>
          <div class="info-value">Oli's Care Specialists</div>
        </div>
      </div>

      <!-- Action Section -->
      <div class="action-section">
        <p style="margin-bottom: 20px; color: #666666;">
          Need further assistance? We're always here to help you.
        </p>
        <a style="color:white;" href="mailto:support@olisknitwear.com" class="action-btn">
          Contact Support Again
        </a>
      </div>

      <!-- Support Note -->
      <div class="support-note">
        <p style="font-style: italic; color: #666666;">
          "At Oli's Knitwear, we believe every conversation is an opportunity to build lasting relationships. 
          Your satisfaction is our highest priority, and we're committed to providing you with exceptional service 
          that matches the quality of our handcrafted pieces."
        </p>
      </div>

      <p style="text-align: center; margin-top: 30px;">
        Thank you for choosing Oli's Knitwear. We appreciate the opportunity to serve you.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-content">
        <div class="brand" style="color: #FAF8F3; font-size: 24px;">Oli's Knitwear</div>
        <div class="footer-links">
          <a href="mailto:support@olisknitwear.com" class="footer-link">Quick Support</a>
          <a href="${process.env.FRONTEND_URL}/faq" class="footer-link" target="_blank">FAQ</a>
          <a href="${process.env.FRONTEND_URL}" class="footer-link" target="_blank">Our Collection</a>
        </div>
        <div class="signature">
          <p>&copy; ${now} Oli's Knitwear. All rights reserved.</p>
          <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
            Crafting Connections Through Exceptional Service
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

    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error replying to message:", error);
    res.status(500).json({ message: "Failed to reply to message" });
  }
};

// Get all message controller
export const getAllMessages = async (req, res) => {
  try {
    const [messages] = await connection.execute(
      `SELECT 
         id, uuid, first_name, last_name, email, subject, message, reply, created_at, replied_at
       FROM messages
       ORDER BY created_at DESC`
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// Get single message controller
export const getSingleMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connection.execute(
      `SELECT 
         id, uuid, first_name, last_name, email, subject, message, reply, created_at, replied_at
       FROM messages
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Failed to fetch message" });
  }
};

// Delete message controller
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connection.execute(`DELETE FROM messages WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
};
