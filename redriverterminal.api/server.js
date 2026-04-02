const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow CORS so the frontend can be hosted on a different origin.
// - default: allow all origins
// - set `CORS_ORIGIN` to a comma-separated allowlist, e.g.:
//   https://redriverterminal.com,https://www.redriverterminal.com
const corsOrigin = process.env.CORS_ORIGIN;
if (!corsOrigin || corsOrigin.trim() === "*") {
  app.use(cors());
} else {
  const origins = corsOrigin
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(cors({ origin: origins }));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// POST route to handle contact form submissions
app.post("/send-mail", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing name/email/message" });
  }

  // SMTP configuration via environment variables
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
  const SMTP_SECURE =
    String(process.env.SMTP_SECURE || "true").toLowerCase() === "true";
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  const MAIL_TO = process.env.MAIL_TO || SMTP_USER;
  const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "Red River Terminal";
  const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL || SMTP_USER;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_TO || !MAIL_FROM_EMAIL) {
    console.error(
      "SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO, and MAIL_FROM_EMAIL."
    );
    return res
      .status(500)
      .json({ success: false, message: "Mail server not configured" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    // Use your SMTP sender as `from` and put the visitor email in `replyTo`.
    // This avoids many providers rejecting "from" addresses you don't control.
    await transporter.sendMail({
      from: `"${MAIL_FROM_NAME}" <${MAIL_FROM_EMAIL}>`,
      replyTo: `"${name}" <${email}>`,
      to: MAIL_TO,
      subject: "New Contact Form Submission",
      text: message,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Message:</strong> ${escapeHtml(message)}</p>`,
    });

    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error sending email" });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
