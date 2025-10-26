import { v4 as uuidv4 } from "uuid";
import connection from "../config/database.config.js"

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

    const [result] = await connection.execute(
      `UPDATE messages SET reply = ?, replied_at = NOW() WHERE id = ?`,
      [reply, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

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
