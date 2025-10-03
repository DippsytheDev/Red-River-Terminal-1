const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST route to handle form
app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Configure mail transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.yourmailserver.com", // e.g., smtp.gmail.com
      port: 465,
      secure: true,
      auth: {
        user: "contact@redriverterminal.com",
        pass: "YOUR_EMAIL_PASSWORD", // use environment variable in production
      },
    });

    // Send mail
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "contact@redriverterminal.com",
      subject: "New Contact Form Submission",
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
