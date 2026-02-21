import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Singleton Email Transporter
 * Creating a transporter is expensive; this utility ensures
 * we reuse the same connection pool throughout the application life.
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Verify connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Mailer Connection Error:", error);
    } else {
        console.log("✅ Mailer is ready to send messages");
    }
});

export default transporter;
