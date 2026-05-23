const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

app.post("/send", async (req, res) => {
  const { emails, subject, message } = req.body;

  let results = [];

  for (let email of emails) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email.trim(),
        subject,
        text: message
      });

      results.push({ email, status: "Sent" });

      await new Promise(r => setTimeout(r, 2000));

    } catch {
      results.push({ email, status: "Failed" });
    }
  }

  res.json(results);
});

app.use(express.static("public"));

app.listen(10000, () => console.log("Server running"));
