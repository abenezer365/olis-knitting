import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (!env.mail.user || !env.mail.pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: env.mail.user, pass: env.mail.pass },
      pool: true,
      maxConnections: 3,
    });
  }
  return transporter;
}

// Sends an email without ever throwing — callers (order/message flows) must not
// fail their request because the mail provider hiccuped. Errors are logged.
// Intentionally not awaited by callers (fire-and-forget) so responses stay fast.
export async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.warn(`✉️  Mailer not configured — skipped email "${subject}" to ${to}`);
    return false;
  }
  try {
    await t.sendMail({ from: env.mail.from, to, subject, html });
    return true;
  } catch (error) {
    console.error(`✉️  Failed to send "${subject}" to ${to}:`, error.message);
    return false;
  }
}
