// server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Endpoint to send SMS messages
app.post('/send-sms', async (req, res) => {
  const { message } = req.body;

  try {
    await axios.post(
      `${process.env.BASE_URL}/sms/2/text/advanced`,
      {
        messages: [
          {
            from: process.env.SENDER_NUMBER,
            destinations: [{ to: process.env.RECIPIENT_NUMBER }],
            text: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `App ${process.env.INFOBIP_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("SMS sent successfully");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Error sending SMS" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
